import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKENDURL } from '../App';
import {
    Accordion, AccordionSummary, AccordionDetails,
    Typography, Checkbox, FormControlLabel, CircularProgress, Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TrackPlan = () => {
    const [trackPlans, setTrackPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrackPlans = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BACKENDURL}/track/trackplan`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.data || response.data.length === 0) {
                    setError('No tracked plans found');
                    return;
                }

                // Verify the structure of the first plan
                console.log("First tracked plan:", response.data[0]);

                setTrackPlans(response.data);
            } catch (err) {
                console.error("Failed to fetch track plans:", err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrackPlans();
    }, []);

    const handleCompletionChange = async (planId, weekNumber, isCompleted) => {
        try {
            await axios.patch(
                `${BACKENDURL}/track/updateCompletion`,
                { planId, weekNumber, isCompleted },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setTrackPlans(prev =>
                prev.map(tp => {
                    if (tp.plan?._id !== planId) return tp;

                    return {
                        ...tp,
                        plan: {
                            ...tp.plan,
                            weeks: tp.plan.weeks.map(w =>
                                w.weekNumber === weekNumber
                                    ? { ...w, isCompleted }
                                    : w
                            ),
                        },
                    };
                })
            );
        } catch (err) {
            console.error("Update failed:", err);
            alert(err.response?.data?.message || err.message);
        }
    };


    const renderWeek = (plan, week) => (
        <Accordion
            key={week.weekNumber}
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '12px',
                '&:before': { display: 'none' },
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
                <Typography sx={{ fontWeight: 600, color: '#fff' }}>
                    Week {week.weekNumber}
                </Typography>

                <FormControlLabel
                    sx={{ marginLeft: 'auto' }}
                    control={
                        <Checkbox
                            checked={week.isCompleted || false}
                            onChange={(e) => {
                                e.stopPropagation();
                                handleCompletionChange(plan._id, week.weekNumber, e.target.checked);
                            }}
                        />
                    }
                    label="Completed"
                />
            </AccordionSummary>

            <AccordionDetails sx={{ color: '#fff' }}>
                <Typography><strong>Difficulty:</strong> {week.difficultyLevel}</Typography>
                <Typography><strong>Topics:</strong> {week.topicsCovered.join(', ')}</Typography>
                <Typography><strong>Exercises:</strong> {week.exercises.join(', ')}</Typography>
                <Typography><strong>Time:</strong> {week.timeCommitment}</Typography>
                <Typography><strong>Resources:</strong> {week.resources.join(', ')}</Typography>
            </AccordionDetails>
        </Accordion>
    );


    if (loading) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px'
        }}>
            <CircularProgress sx={{ color: '#4caf50' }} />
        </div>
    );

    if (error) return (
        <div style={{ padding: '24px' }}>
            <Alert severity="error" sx={{
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                color: '#ffffff',
                border: '1px solid #d32f2f',
                borderRadius: '8px'
            }}>
                {error}
            </Alert>
        </div>
    );

    if (trackPlans.length === 0) return (
        <div style={{
            padding: '24px',
            textAlign: 'center',
            color: '#bbbbbb'
        }}>
            <Typography variant="h6">No plans being tracked yet.</Typography>
            <Typography variant="body1" sx={{ marginTop: '8px' }}>
                Start by adding a learning plan to track your progress.
            </Typography>
        </div>
    );

    return (
        <div style={{
            padding: '24px',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <Typography variant="h4" sx={{
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                Your Tracked Plans
            </Typography>

            {trackPlans.map(trackPlan => (
                <Accordion key={trackPlan._id} sx={{
                    marginBottom: '24px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    '&:before': { display: 'none' },
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: '#ffffff' }} />}
                        sx={{
                            padding: '16px 24px',
                            minHeight: '72px',
                            '& .MuiAccordionSummary-content': {
                                alignItems: 'center'
                            }
                        }}
                    >
                        <Typography variant="h5" sx={{ color: '#fff' }}>
                            {trackPlan.plan.subject.toUpperCase()} – {trackPlan.plan.planDuration} Week Plan
                        </Typography>

                    </AccordionSummary>

                    <AccordionDetails sx={{
                        padding: '0 24px 24px',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)'
                    }}>
                        {trackPlan.plan ? (
                            <>
                                <div style={{ marginTop: '16px' }}>

                                    {trackPlan.plan?.weeks?.map((week) =>
                                        renderWeek(trackPlan.plan, week)
                                    )}
                                </div>

                            </>
                        ) : (
                            <Alert severity="warning" sx={{
                                backgroundColor: 'rgba(255, 167, 38, 0.1)',
                                color: '#ffffff',
                                border: '1px solid #ffa726',
                                borderRadius: '8px',
                                marginTop: '16px'
                            }}>
                                Plan data not available
                            </Alert>
                        )}
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default TrackPlan;