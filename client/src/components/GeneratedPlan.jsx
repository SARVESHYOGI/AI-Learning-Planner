import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

function GeneratedPlan(props) {
    const { plans, deleteplan, trackplan } = props;
    // const white = 'white';
    console.log(plans);
    const [confirmDeleteId, setConfirmDeleteId] = React.useState(null);

    const handleDelete = (planId) => {
        setConfirmDeleteId(planId);
    };

    const confirmDelete = () => {
        if (confirmDeleteId) {
            deleteplan(confirmDeleteId);
            setConfirmDeleteId(null);
        }
    };

    const cancelDelete = () => {
        setConfirmDeleteId(null);
    };

    return (
        <div className="space-y-6 px-4 sm:px-6 py-6 sm:py-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-lg">
            {plans.map((plan, planIndex) => (
                <div
                    key={plan._id || planIndex}
                    className="rounded-xl shadow-md bg-black/30 backdrop-blur-md border border-white/20 p-4 sm:p-6 mb-6"
                >
                    <Accordion
                        sx={{
                            backgroundColor: "rgba(30, 41, 59, 0.7)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "0.75rem",
                            marginBottom: "1rem",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                            "&:before": { display: "none" },
                            color: "white",
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                            aria-controls={`plan-${planIndex}-content`}
                            id={`plan-${planIndex}-header`}
                        >
                            <div className="flex flex-col gap-1">
                                <Typography color="white" variant="h6" sx={{ fontWeight: 700 }}>
                                    Plan {planIndex + 1}
                                </Typography>
                                <Typography color="white" variant="body2">
                                    <strong>Subject:</strong> {plan.subject}
                                </Typography>

                                <Typography color="white" variant="body2">
                                    <strong>Plan Duration:</strong> {plan.planDuration} Weeks
                                </Typography>
                            </div>
                        </AccordionSummary>

                        <AccordionDetails>
                            <Typography color="white" variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                Study Plan ({plan.planDuration} Weeks)
                            </Typography>

                            {plan.weeks.map((week, index) => (
                                <Accordion
                                    key={`week-${index}`}
                                    sx={{
                                        backgroundColor: "rgba(30, 41, 59, 0.6)",
                                        backdropFilter: "blur(8px)",
                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                        borderRadius: "0.5rem",
                                        marginBottom: "0.75rem",
                                        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                                        "&:before": { display: "none" },
                                        color: "white",
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                                        aria-controls={`week-${index}-content`}
                                        id={`week-${index}-header`}
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between w-full">
                                            <Typography color="white" sx={{ fontWeight: 500 }}>
                                                Week {week.weekNumber}
                                            </Typography>
                                            <Typography color="white" className="text-sm sm:text-base">
                                                <strong>Difficulty:</strong> {week.difficultyLevel}
                                            </Typography>
                                        </div>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <ul className="space-y-2 text-white/90 text-sm sm:text-base pl-2">
                                            <li><strong>Topics:</strong> {week.topicsCovered?.join(", ") || "N/A"}</li>
                                            <li><strong>Exercises:</strong> {week.exercises?.join(", ") || "N/A"}</li>
                                            <li><strong>Time Commitment:</strong> {week.timeCommitment}</li>
                                            <li><strong>Resources:</strong> {week.resources?.join(", ") || "N/A"}</li>
                                        </ul>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </AccordionDetails>
                    </Accordion>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                        <button
                            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 text-sm sm:text-base rounded-lg shadow transition w-full sm:w-auto"
                            onClick={() => handleDelete(plan._id)}
                        >
                            Delete Plan {planIndex + 1}
                        </button>

                        <button
                            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 text-sm sm:text-base rounded-lg shadow transition w-full sm:w-auto"
                            onClick={() => trackplan(plan._id)}
                        >
                            Track Plan {planIndex + 1}
                        </button>
                    </div>
                </div>
            ))}
            {confirmDeleteId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 px-4">
                    <div className="bg-gray-900 rounded-xl p-6 w-full max-w-sm shadow-xl border border-white/20 text-white">
                        <h2 className="text-base sm:text-lg font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-6 text-sm sm:text-base">Are you sure you want to delete this plan?</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-end">
                            <button className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg w-full sm:w-auto" onClick={confirmDelete} > Yes, Delete </button>
                            <button className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg w-full sm:w-auto" onClick={cancelDelete} > Cancel </button>
                        </div>
                    </div>
                </div>)
            }
        </div>


    );
}

export default GeneratedPlan