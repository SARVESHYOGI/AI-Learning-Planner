import React, { useEffect, useState } from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails,
    Typography, Checkbox, FormControlLabel, CircularProgress, Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../api/axios';
import { Snackbar } from "@mui/material";


const TrackPlan = () => {
    const [trackPlans, setTrackPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");


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

    const handleCompletionChange = async (planId, dayNumber, isCompleted) => {
        const res = await api.patch(
            "/track/updateCompletion",
            { planId, dayNumber, isCompleted },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        if (res.data.notification) {
            setToastMessage(res.data.notification);
            setToastOpen(true);
        }


        setTrackPlans(prev =>
            prev.map(tp =>
                tp.plan._id === planId
                    ? {
                        ...tp,
                        plan: {
                            ...tp.plan,
                            days: tp.plan.days.map(d =>
                                d.dayNumber === dayNumber
                                    ? { ...d, isCompleted }
                                    : d
                            ),
                        },
                    }
                    : tp
            )
        );
    };

    const renderDay = (planId, dayData, index) => {
        if (!dayData) return null;

        return (
            <Accordion key={`day-${index}`} sx={{
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
                            Day {dayData.dayNumber}
                        </Typography>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <Typography variant="body2" sx={{ color: '#bbbbbb' }}>
                                Difficulty: <span style={{ color: '#fff' }}>{dayData.difficultyLevel}</span>
                            </Typography>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={dayData.isCompleted || false}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleCompletionChange(
                                                planId,
                                                dayData.dayNumber,
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
                        <strong style={{ color: '#bbbbbb' }}>Topics:</strong> {dayData.topicsCovered.join(', ')}
                    </Typography>

                    <Typography variant="body1">
                        <strong style={{ color: '#bbbbbb' }}>Exercises:</strong> {dayData.exercises.join(', ')}
                    </Typography>

                    <Typography variant="body1">
                        <strong style={{ color: '#bbbbbb' }}>Time Commitment:</strong> {dayData.timeCommitment}
                    </Typography>

                    <Typography variant="body1">
                        <strong style={{ color: '#bbbbbb' }}>Resources:</strong>
                        {dayData.resources.map((r, i) => (
                            <span key={i}>
                                <a href={r} target="_blank" rel="noopener noreferrer" style={{ color: '#4caf50' }}>
                                    {r}
                                </a>
                                {i < dayData.resources.length - 1 ? ', ' : ''}
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
            <Snackbar
                open={toastOpen}
                autoHideDuration={3000}
                onClose={() => setToastOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    severity="success"
                    onClose={() => setToastOpen(false)}
                    sx={{ backgroundColor: "#2e7d32", color: "#fff", fontWeight: 600 }}
                >
                    {toastMessage}
                </Alert>
            </Snackbar>

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
                                <span style={{ fontWeight: 600 }}>Plan Duration:</span> {trackPlan.plan?.planDuration || 'N/A'} days
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
                                        {trackPlan.plan.days.length}-days Plan
                                    </Typography>
                                    {trackPlan.plan.days?.map((dayData, index) =>
                                        renderDay(trackPlan.plan._id, dayData, index)
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