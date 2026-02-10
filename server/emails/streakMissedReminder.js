const cron = require("node-cron");
const Plan = require("../models/Plan");
const { sendEmail } = require("../services/mailService");

const DEV_WINDOW = Number(process.env.DEV_STREAK_WINDOW_SECONDS || 60);
const MAX_GRACE_SECONDS = DEV_WINDOW * 2;

cron.schedule("*/10 * * * * *", async () => {
    console.log("⏰ DEV streak reminder check running");

    const now = new Date();

    const plans = await Plan.find({
        dailyStreak: { $gt: 0 },
        lastActivityDate: { $ne: null },
        status: { $ne: "completed" },
    }).populate("userId", "email");

    for (const plan of plans) {

        const allDaysCompleted = plan.days.every(d => d.isCompleted === true);
        if (allDaysCompleted) continue;

        const diffSeconds =
            (now.getTime() - plan.lastActivityDate.getTime()) / 1000;

        if (process.env.NODE_ENV === "development") {
            if (diffSeconds < DEV_WINDOW) continue;
            if (diffSeconds > MAX_GRACE_SECONDS) continue;
        }

        if (process.env.NODE_ENV === "production") {
            const last = new Date(plan.lastActivityDate);
            const today = new Date();

            if (
                last.getFullYear() === today.getFullYear() &&
                last.getMonth() === today.getMonth() &&
                last.getDate() === today.getDate()
            ) {
                continue;
            }
        }

        if (
            plan.streakMissedNotifiedAt &&
            (now - plan.streakMissedNotifiedAt) < DEV_WINDOW * 1000
        ) {
            continue;
        }

        console.log("📧 Sending streak-missed reminder");

        sendEmail({
            to: plan.userId.email,
            subject: "⏰ Streak at risk!",
            html: `
        <h3>⚠️ Your streak is at risk</h3>
        <p>No activity in the last <b>${DEV_WINDOW} seconds</b>.</p>
        <p>Complete today to keep your streak 🔥</p>
      `,
        }).catch(console.error);

        plan.streakMissedNotifiedAt = now;
        await plan.save();
    }
});
