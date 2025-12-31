import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';


function PlanPage() {
    const plan = useSelector((state) => state.plan.plan);
    console.log("plan from planpage", plan);

    // Ensure the plan exists
    if (!plan.submittedInformation || !plan.plan) {
        return <div className="text-red-500">Plan not found.</div>;
    }

    const selectedPlan = plan.plan;

    return (
        <div className="p-6" style={{ backgroundColor: 'transparent', color: 'white' }}>
            <h2 className="text-2xl font-bold m-4">Your plan:</h2>
            <div>
                {Object.keys(selectedPlan).map((week) => (
                    <div key={week} className="mb-6">
                        <ul>
                            <Accordion
                                slotProps={{ heading: { component: 'h4' } }}
                                sx={{
                                    backgroundColor: 'rgba(1, 1, 1, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '0.375rem',
                                    marginBottom: '1rem',
                                    '&:before': {
                                        display: 'none',
                                    },
                                    color: 'white',


                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                    sx={{ backgroundColor: 'transparent', color: 'white' }}
                                >
                                    <Typography component="span" sx={{ width: '33%', flexShrink: 0, color: 'white' }}>
                                        <h3 className="text-xl font-semibold">{week}</h3>
                                    </Typography>
                                    <Typography component="span" sx={{ color: 'white' }}>
                                        <li><strong>Difficulty:</strong> {selectedPlan[week].difficultyLevel}</li>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: 'transparent', color: 'white' }}>
                                    <li><strong>Topics Covered:</strong> {selectedPlan[week].topicsCovered.join(', ')}</li>
                                    <li><strong>Exercises:</strong> {selectedPlan[week].exercises.join(', ')}</li>
                                    <li><strong>Time Commitment:</strong> {selectedPlan[week].timeCommitment}</li>
                                    <li><strong>Resources:</strong> {selectedPlan[week].resources.join(', ')}</li>
                                </AccordionDetails>
                            </Accordion>
                        </ul>
                    </div>
                ))}
            </div>
            <div className='bg-green-500 p-2 rounded-xl w-fit'><Link to='/questionnaire'>Go back</Link></div>
        </div>
    );
}

export default PlanPage;