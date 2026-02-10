const TrackPlan = require("../models/TrackPlan");
const Plan = require("../models/Plan");
const mongoose = require("mongoose");
const { sendEmail } = require("../services/mailService");
const { streakCompletedTemplate } = require("../emails/streakCompleted");


const addtotrackplan = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Tracking plan with ID:", id);
        if (!id) {
            return res.status(400).json({ message: "Plan ID is required" });
        }
        const planObjectId = new mongoose.Types.ObjectId(id);
        const existingTrackPlan = await TrackPlan.findOne({ planId: planObjectId, userId: req.userId });
        if (existingTrackPlan) {
            return res.status(400).json({ message: "Plan already tracked" });
        }
        const userId = req.userId;
        const trackPlan = new TrackPlan({
            userId,
            planId: planObjectId
        });
        await trackPlan.save();
        console.log("Plan tracked successfully:", trackPlan);
        res.status(200).json({ message: "Plan tracked successfully", id });
    } catch (error) {
        console.error("Error tracking plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const gettrackplan = async (req, res) => {
    try {
        const userId = req.userId;

        const trackplans = await TrackPlan.find({ userId }).lean();

        // if (!trackplans || trackplans.length === 0) {
        //     return res.status(404).json({ message: "No track plans found" });
        // }
        if (!trackplans.length) {
            return res.status(200).json([]);
        }

        const planIds = trackplans.map(tp => tp.planId);
        const plans = await Plan.find({ _id: { $in: planIds } }).lean();

        const combinedData = trackplans.map(trackplan => {
            const plan = plans.find(p => p._id.toString() === trackplan.planId.toString());
            return {
                ...trackplan,
                plan: plan || null
            };
        });

        console.log("Combined data:", combinedData);
        res.status(200).json(combinedData);
    } catch (error) {
        console.error("Error fetching track plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


const isSameDay = (d1, d2) => {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
};

const isYesterday = (lastDate, today) => {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return isSameDay(lastDate, yesterday);
};



const updateCompletion = async (req, res) => {
    try {
        const { planId, dayNumber, isCompleted } = req.body;

        if (!planId || !dayNumber || typeof isCompleted !== "boolean") {
            return res.status(400).json({
                message: "planId, dayNumber, and isCompleted are required",
            });
        }

        const plan = await Plan.findById(planId).populate("userId", "email");
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        const day = plan.days.find(d => d.dayNumber === dayNumber);
        if (!day) {
            return res.status(404).json({ message: "Day not found" });
        }

        // update day
        day.isCompleted = isCompleted;

        // check completion
        const allDaysCompleted = plan.days.every(d => d.isCompleted === true);
        if (allDaysCompleted) {
            plan.status = "completed";
        }

        // 🔒 STOP streak updates if plan already completed
        if (plan.status === "completed") {
            await plan.save();
            return res.status(200).json({
                message: "Plan completed 🎉",
                notification: "🎉 You’ve completed the entire plan!",
                plan,
            });
        }

        const today = new Date();
        let notification = null;
        let streakUpdated = false;

        if (isCompleted) {
            if (!plan.lastActivityDate) {
                plan.dailyStreak = 1;
                streakUpdated = true;
            } else if (isSameDay(plan.lastActivityDate, today)) {
                notification =
                    "ℹ️ Day completed! Today already counted for streak 🔥";
            } else if (isYesterday(plan.lastActivityDate, today)) {
                plan.dailyStreak += 1;
                streakUpdated = true;
            } else {
                plan.dailyStreak = 1;
                streakUpdated = true;
            }

            if (streakUpdated) {
                plan.lastActivityDate = today;
                plan.longestStreak = Math.max(
                    plan.longestStreak,
                    plan.dailyStreak
                );

                notification =
                    plan.dailyStreak === 1
                        ? "✅ Day 1 completed! Great start"
                        : `🔥 ${plan.dailyStreak}-day streak! Keep going`;
            }
        }

        await plan.save();

        // send email only when streak changes
        if (streakUpdated) {
            sendEmail({
                to: plan.userId.email,
                subject: `🔥 ${plan.dailyStreak}-Day Learning Streak!`,
                html: streakCompletedTemplate(plan.dailyStreak),
            }).catch(console.error);
        }

        res.status(200).json({
            message: "Day updated successfully",
            dailyStreak: plan.dailyStreak,
            notification,
            plan,
        });

    } catch (error) {
        console.error("Error updating completion:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};





const deleteTrackPlan = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Track plan ID is required" });
        }
        await TrackPlan.findByIdAndDelete(id);
        res.status(200).json({ message: "Track plan deleted successfully" });
    } catch (error) {
        console.error("Error deleting track plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateTrackPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { planId } = req.body;
        if (!id || !planId) {
            return res.status(400).json({ message: "Track plan ID and new plan ID are required" });
        }
        const updatedTrackPlan = await TrackPlan.findByIdAndUpdate(id, { planId }, { new: true });
        res.status(200).json(updatedTrackPlan);
    } catch (error) {
        console.error("Error updating track plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    addtotrackplan,
    gettrackplan,
    deleteTrackPlan,
    updateTrackPlan,
    updateCompletion
};