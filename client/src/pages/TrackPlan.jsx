import React, { useEffect, useState } from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails,
    Typography, Checkbox, FormControlLabel, CircularProgress, Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../api/axios';

const TrackPlan = () => {
    const [trackPlans, setTrackPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrackPlans = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/track/trackplan`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.data || response.data.length === 0) {
                    setError('No tracked plans found');
                    return;
                }

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
            console.log("Updating completion:", planId, weekNumber, isCompleted);
            await api.patch(`/track/updateCompletion`, {
                planId,
                weekNumber,
                isCompleted
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setTrackPlans(prev =>
                prev.map(trackPlan => {
                    if (trackPlan.plan?._id === planId) {
                        return {
                            ...trackPlan,
                            plan: {
                                ...trackPlan.plan,
                                weeks: trackPlan.plan.weeks.map(week =>
                                    week.weekNumber === weekNumber
                                        ? { ...week, isCompleted }
                                        : week
                                ),
                            },
                        };
                    }
                    return trackPlan;
                })
            );
        } catch (err) {
            console.error("Update failed:", err);
            alert(`Update failed: ${err.response?.data?.message || err.message}`);
        }
    };


    const renderWeek = (planId, weekData, index) => {
        if (!weekData) return null;

        return (
            <Accordion key={`week-${index}`} sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:before': { display: 'none' }
            }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#ffffff' }} />}
                    sx={{ padding: '12px 16px', minHeight: '56px' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ffffff' }}>
                            Week {weekData.weekNumber}
                        </Typography>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <Typography variant="body2" sx={{ color: '#bbbbbb' }}>
                                Difficulty: <span style={{ color: '#fff' }}>{weekData.difficultyLevel}</span>
                            </Typography>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={weekData.isCompleted || false}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleCompletionChange(
                                                planId,
                                                weekData.weekNumber,
                                                Boolean(e.target.checked)
                                            );
                                        }}
                                        sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }}
                                    />
                                }
                                label={<Typography variant="body2" sx={{ color: '#bbbbbb' }}>Completed</Typography>}
                            />
                        </div>
                    </div>
                </AccordionSummary>

                <AccordionDetails sx={{
                    padding: '16px 24px',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff'
                }}>
                    <Typography variant="body1">
                        <strong style={{ color: '#bbbbbb' }}>Topics:</strong> {weekData.topicsCovered.join(', ')}
                    </Typography>

                    <Typography variant="body1">
                        <strong style={{ color: '#bbbbbb' }}>Exercises:</strong> {weekData.exercises.join(', ')}
                    </Typography>

                    <Typography variant="body1">
                        <strong style={{ color: '#bbbbbb' }}>Time Commitment:</strong> {weekData.timeCommitment}
                    </Typography>

                    <Typography variant="body1">
                        <strong style={{ color: '#bbbbbb' }}>Resources:</strong>
                        {weekData.resources.map((r, i) => (
                            <span key={i}>
                                <a href={r} target="_blank" rel="noopener noreferrer" style={{ color: '#4caf50' }}>
                                    {r}
                                </a>
                                {i < weekData.resources.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </Typography>
                </AccordionDetails>
            </Accordion >
        );
    };



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
                        <Typography variant="h5" sx={{
                            fontWeight: 600,
                            color: '#ffffff',
                            flexGrow: 1
                        }}>
                            {trackPlan.plan?.subject || 'Untitled Plan'}
                        </Typography>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Typography variant="body2" sx={{ color: '#bbbbbb' }}>
                                <span style={{ fontWeight: 600 }}>Plan Duration:</span> {trackPlan.plan?.planDuration || 'N/A'} weeks
                            </Typography>
                        </div>
                    </AccordionSummary>

                    <AccordionDetails sx={{
                        padding: '0 24px 24px',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)'
                    }}>
                        {trackPlan.plan ? (
                            <>
                                <div style={{ marginTop: '16px' }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        color: '#ffffff',
                                        marginBottom: '16px',
                                        paddingBottom: '8px',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}>
                                        {trackPlan.plan.weeks.length}-week Plan
                                    </Typography>
                                    {trackPlan.plan.weeks?.map((weekData, index) =>
                                        renderWeek(trackPlan.plan._id, weekData, index)
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