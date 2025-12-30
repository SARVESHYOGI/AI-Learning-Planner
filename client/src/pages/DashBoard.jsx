import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import GeneratedPlan from '../components/GeneratedPlan'
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
        <div className="mx-auto px-4 py-10 max-w-5xl text-white">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 p-6 sm:p-8 space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center sm:text-left">
                        My Plans
                    </h1>
                </div>

                <div className="flex flex-col gap-6 sm:gap-8">
                    <div className="bg-blue-500 bg-opacity-20 rounded-xl p-4 sm:p-6 shadow-lg border border-blue-400/40">
                        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                            Generate New Plan
                        </h2>
                        <Link to="/questionnaire" className="block">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                Create New Plan
                            </button>
                        </Link>
                    </div>

                    <div className="bg-gray-700 bg-opacity-30 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-500/40">
                        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                            My Generated Plans
                        </h2>
                        {plans && plans.length > 0 ? (
                            <GeneratedPlan deleteplan={deleteplan} plans={plans} trackplan={trackplan} />
                        ) : (
                            <div className="text-center text-gray-300 py-6 sm:py-8">
                                No plans generated yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default DashBoard