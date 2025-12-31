import React, { useState, memo } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DifficultyBadge = ({ level }) => {
    const color =
        level === "Beginner"
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/30"
            : level === "Intermediate"
                ? "bg-amber-500/20 text-amber-400 border border-amber-400/30"
                : "bg-red-500/20 text-red-400 border border-red-400/30";

    return (
        <span className={`${color} text-xs px-3 py-1 rounded-full font-semibold`}>
            {level}
        </span>
    );
};

function GeneratedPlan({ plans, deleteplan, trackplan }) {
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    return (
        <div className="space-y-8">
            {plans.map((plan, index) => (
                <div
                    key={plan._id}
                    className="
            rounded-2xl bg-slate-900/70
            border border-slate-700/40
            p-6 shadow-xl transition
            hover:bg-slate-800/70
          "
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-bold">📘 Plan {index + 1}</h3>
                            <p className="text-slate-400 text-sm">
                                {plan.subject} • {plan.planDuration} weeks
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => trackplan(plan._id)}
                                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm shadow-lg shadow-blue-600/30"
                            >
                                Track
                            </button>
                            <button
                                onClick={() => setConfirmDeleteId(plan._id)}
                                className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm shadow-lg shadow-red-600/30"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Accordion */}
                    <Accordion
                        sx={{
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            "&:before": { display: "none" },
                            color: "white",
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
                            Study Breakdown
                        </AccordionSummary>

                        <AccordionDetails className="space-y-4">
                            {plan.weeks.map((week) => (
                                <Accordion
                                    key={week.weekNumber}
                                    sx={{
                                        backgroundColor: "rgba(30,41,59,0.7)",
                                        border: "1px solid rgba(148,163,184,0.2)",
                                        borderRadius: "0.75rem",
                                        "&:before": { display: "none" },
                                        color: "white",
                                    }}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
                                        <div className="flex justify-between w-full">
                                            <span>Week {week.weekNumber}</span>
                                            <DifficultyBadge level={week.difficultyLevel} />
                                        </div>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <ul className="text-sm text-slate-300 space-y-2">
                                            <li><strong>Topics:</strong> {week.topicsCovered.join(", ")}</li>
                                            <li><strong>Exercises:</strong> {week.exercises.join(", ")}</li>
                                            <li><strong>Time:</strong> {week.timeCommitment}</li>
                                            <li><strong>Resources:</strong> {week.resources.join(", ")}</li>
                                        </ul>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                </div>
            ))}

            {/* Delete Modal */}
            {confirmDeleteId && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-700/40 rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
                        <p className="text-slate-400 mb-6">This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmDeleteId(null)} className="bg-slate-700 px-4 py-2 rounded-lg">
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteplan(confirmDeleteId);
                                    setConfirmDeleteId(null);
                                }}
                                className="bg-red-600 px-4 py-2 rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(GeneratedPlan);
