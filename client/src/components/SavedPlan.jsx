import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

function SavedPlan(props) {
    const { plans, deleteplan, trackplan } = props;

    return (
        <div className="space-y-6">
            {plans.map((plan) => (
                <div key={plan._id} className="mb-8">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">
                            {plan.subject.toUpperCase()} – {plan.planDuration}-Week Plan
                        </h2>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-md text-white"
                                onClick={() => trackplan(plan._id)}
                            >
                                Track
                            </button>

                            <button
                                className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded-md text-white"
                                onClick={() => deleteplan(plan._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Weeks */}
                    {plan.weeks.map((week) => (
                        <Accordion
                            key={week.weekNumber}
                            sx={{
                                backgroundColor: 'rgba(1, 1, 1, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '0.375rem',
                                marginBottom: '1rem',
                                '&:before': { display: 'none' },
                                color: 'white',
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ width: '33%', color: 'white' }}>
                                    Week {week.weekNumber}
                                </Typography>

                                <Typography sx={{ color: 'white' }}>
                                    <strong>Difficulty:</strong> {week.difficultyLevel}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                <ul className="space-y-2">
                                    <li>
                                        <strong>Topics Covered:</strong>{" "}
                                        {week.topicsCovered.join(', ')}
                                    </li>
                                    <li>
                                        <strong>Exercises:</strong>{" "}
                                        {week.exercises.join(', ')}
                                    </li>
                                    <li>
                                        <strong>Time Commitment:</strong> {week.timeCommitment}
                                    </li>
                                    <li>
                                        <strong>Resources:</strong>{" "}
                                        {week.resources.join(', ')}
                                    </li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default SavedPlan;
