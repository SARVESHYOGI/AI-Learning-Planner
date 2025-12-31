import React, { useState } from "react";
import Card from "../components/Card";
import { useSelector } from "react-redux";
import axios from "axios";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { BACKENDURL } from "../App";
import { Link } from "react-router-dom";
import PlanPage from "./PlanPage";


const Generatedplans = () => {
    const plan = useSelector((state) => state.plan.plan);
    console.log("Plan from Redux store:", typeof plan);
    console.log("Plan from Redux store:", plan.plan);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [minLoading, setMinLoading] = useState(false);

    if (!plan) {
        return <div><Loading /></div>;
    }

    const addplan = () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        const minLoadingTimer = setTimeout(() => {
            setMinLoading(true);
        }, 1500);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Unauthorized. Please log in.');
            clearTimeout(minLoadingTimer);
            setLoading(false);
            return;
        }
        const paylod = {
            subject: plan.subject,
            plan: plan
        }

        axios.post(`${BACKENDURL}/plan/saveplan`, paylod, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                console.log(res.data);
                setSuccess(true);
                setLoading(false);
                toast.success("Plan added to database successfully!");
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to save plan.");
                toast.error("Failed to save plan.");
            }).finally(() => {
                clearTimeout(minLoadingTimer);
                setLoading(false);
            });
    };

    if (loading && !minLoading) {
        return <Loading />;
    }
    if (Object.keys(plan).length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-64 bg-slate-900/70 backdrop-blur-xl border border-slate-700/40 text-white flex flex-col items-center justify-center p-6 rounded-xl shadow-xl">

                    <p className="mb-4 text-lg font-semibold">No New plan generated</p>
                    <Link to='/questionnaire'>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg shadow-blue-600/30 transition duration-200 m-1  mx-auto flex justify-center w-full">
                            Generate New Plan
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg shadow-blue-600/30 transition duration-200 m-1 mx-auto flex justify-center w-full">
                            previous Plans
                        </button>
                    </Link>

                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap flex-col justify-center m-auto items-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-black min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-blue-400">Your New Learning Plan for</h1>

            {/* Render the submitted information */}

            <div className="flex flex-wrap justify-center  items-center text-white w-full max-w-2xl">
                <div className="">
                    {plan.submittedInformation && Object.keys(plan.submittedInformation).map((key) => (
                        <div key={key} className="shadow-lg p-3 space-y-2 bg-slate-900/60 rounded-xl backdrop-blur-xl border border-slate-700/40">
                            <strong>{key}:</strong> {plan.submittedInformation[key]}
                        </div>
                    ))}
                </div>
            </div>

            <PlanPage />
            {/* Success/Error Messages */}
            {success && <div className="text-emerald-400 font-medium">Plan saved successfully!</div>}
            {error && <div className="text-red-400 font-medium">{error}</div>}

            {/* Add Plan Button */}
            <button
                className="text-white
    bg-emerald-600 hover:bg-emerald-500
    px-6 py-3 rounded-xl
    font-semibold
    shadow-lg shadow-emerald-600/30
    transition"
                onClick={addplan}
                disabled={loading}
            >
                {loading ? "Saving..." : "Add Plan to DB"}
            </button>
        </div >
    );
};

export default Generatedplans;
