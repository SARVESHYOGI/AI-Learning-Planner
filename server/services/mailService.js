const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
console.log("MAIL SERVICE EMAIL_USER:", process.env.EMAIL_USER);
console.log("MAIL SERVICE EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async ({ to, subject, html }) => {
    return transporter.sendMail({
        from: `"AI Learning App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

module.exports = { sendEmail };
