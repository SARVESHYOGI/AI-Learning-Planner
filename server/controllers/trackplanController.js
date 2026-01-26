const TrackPlan = require("../models/TrackPlan");
const Plan = require("../models/Plan");

const addtotrackplan = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Tracking plan with ID:", id);
        if (!id) {
            return res.status(400).json({ message: "Plan ID is required" });
        }
        const existingTrackPlan = await TrackPlan.findOne({ planId: id, userId: req.userId });
        if (existingTrackPlan) {
            return res.status(400).json({ message: "Plan already tracked" });
        }
        const userId = req.userId;
        const trackPlan = new TrackPlan({
            userId,
            planId: id
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

const updateCompletion = async (req, res) => {
    try {
        const { planId, weekNumber, isCompleted } = req.body;

        if (!planId || !weekNumber || typeof isCompleted !== 'boolean') {
            return res.status(400).json({ message: 'planId, weekNumber, and isCompleted are required' });
        }

        const updatedPlan = await Plan.findOneAndUpdate(
            { _id: planId, "weeks.weekNumber": weekNumber },
            {
                $set: {
                    "weeks.$.isCompleted": isCompleted
                }
            },
            { new: true }
        );

        if (!updatedPlan) {
            return res.status(404).json({ message: "Plan or week not found" });
        }

        res.status(200).json({
            message: "Week completion updated successfully",
            updatedPlan
        });

    } catch (error) {
        console.error("Error updating completion:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


const getPlan = async (planId) => {
    console.log('Fetching plan for ID:', planId);
    try {
        const plan = await Plan.findById(planId);
        console.log('Plan data:', plan);
        return plan;
    } catch (error) {
        console.error('Error getting plan:', error);
        throw new Error('Failed to get plan');
    }
}


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