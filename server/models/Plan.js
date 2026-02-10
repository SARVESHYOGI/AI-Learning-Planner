const mongoose = require("mongoose");

const daySchema = new mongoose.Schema(
    {
        dayNumber: {
            type: Number,
            required: true,
        },
        topicsCovered: [String],
        exercises: [String],
        difficultyLevel: {
            type: String,
        },
        timeCommitment: String,
        resources: [String],
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);


const planSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        subject: {
            type: String,
            required: true,
        },
        planDuration: {
            type: Number,
            required: true,
        },
        days: {
            type: [daySchema],
            required: true,
        },

        status: {
            type: String,
            enum: ["incomplete", "completed"],
            default: "incomplete",
        },
        dailyStreak: {
            type: Number,
            default: 0,
        },

        lastActivityDate: {
            type: Date,
            default: null,
        },

        longestStreak: {
            type: Number,
            default: 0,
        },

        streakNotifiedForDate: {
            type: Date,
            default: null,
        },
        streakMissedNotifiedAt: {
            type: Date,
            default: null,
        }


    },
    { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);