import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import SavedPlan from '../components/SavedPlan'
import toast from 'react-hot-toast'
import Loading from '../components/Loading'
import { BACKENDURL } from '../App'

function DashBoard() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [minLoading, setMinLoading] = useState(false);

    const deleteplan = async (id) => {
        console.log('Deleting plan with ID:', id);
        try {
            setLoading(true);
            const response = await axios.delete(`${BACKENDURL}/plan/deleteplan/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            console.log('Plan deleted:', response.data);
            setLoading(false);

            toast.success("Plan deleted successfully.");
            setPlans(prevPlans => prevPlans.filter(plan => plan._id !== id));
        } catch (err) {
            console.error('Error deleting plan:', err);
            setLoading(false);
            toast.error("Failed to delete plan. Please try again.");
        }
    };

    const trackplan = async (id) => {
        console.log("added to tracking plan");
        try {
            console.log("tracking ", id);
            const response = await axios.post(`${BACKENDURL}/track/trackplan/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log("Trackplan from dashboard", response);
            toast.success("Plan added to tracking successfully.");
        } catch (error) {
            toast.error("Failed to add plan to tracking. Plan already exists.");
            console.log(error);
        }
    }

    const getPlans = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token is missing");
                alert("You are not logged in. Please log in first.");
                setLoading(false);
                return;
            }

            const response = await axios.get(`${BACKENDURL}/plan/getplan`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Plan data:', response.data);
            setPlans(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error);
            if (error.response && error.response.status === 401) {
                alert("Session expired or invalid token. Please log in again.");
            } else {
                console.error('Error fetching plan data:', error);
                alert("An error occurred while fetching the plan data.");
            }
        }
    };

    useEffect(() => {
        const minLoadingTime = setTimeout(() => {
            setMinLoading(false);
        }, 1500);

        setMinLoading(true);

        return () => clearTimeout(minLoadingTime);
    }, []);
    useEffect(() => {
        getPlans();
    }, []);

    if (loading || minLoading) {
        return <div><Loading /></div>;
    }

    if (error) {
        return <div>Error loading data. Please try again later.</div>;
    }


    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl text-white">
            <div className="bg-white shadow-md p-6 space-y-6 bg-transparent rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">My Plans</h1>
                </div>

                <div className="flex flex-col   items-stretch gap-6">
                    <div className="flex-1 bg-blue-50  p-4 shadow-sm bg-transparent rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
                        <h2 className="text-lg font-semibold text-whitemb-4">
                            Generate New Plan
                        </h2>
                        <Link to="/questionnaire" className="block">
                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                Create New Plan
                            </button>
                        </Link>
                    </div>


                </div>

            </div>
            <div className="flex-1 bg-gray-50 p-4 shadow-sm bg-transparent rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
                <h2 className="text-lg font-semibold text-whitemb-4">
                    My Generated Plans
                </h2>
                {plans ? (<>
                    {/* <div>hi</div> */}
                    <SavedPlan deleteplan={deleteplan} plans={plans} trackplan={trackplan} />
                </>) : (
                    <div className="text-center text-gray-500">
                        No plans generated yet
                    </div>
                )}

            </div>
        </div>
    )
}

export default DashBoard