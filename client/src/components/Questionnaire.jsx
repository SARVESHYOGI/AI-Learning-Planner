import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPlan } from "../store/planSlice";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { BACKENDURL } from "../App";
import { motion, AnimatePresence } from "framer-motion";

const questionVariants = {
    enter: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 100 : -100, opacity: 0 }),
};



const Questionnaire = () => {
    const [loading, setLoading] = useState(false);
    const [fetchingForm, setFetchingForm] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [direction, setDirection] = useState(1);
    const [formFields, setFormFields] = useState([]);
    const [topic, setTopic] = useState("");
    const [started, setStarted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleStart = async () => {
        if (!topic || topic.trim() === "") {
            toast.error("Please enter a topic to continue.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You are not logged in. Please log in first.");
            return;
        }

        try {
            setFetchingForm(true);
            const response = await axios.post(
                `${BACKENDURL}/plan/generatequestion`,
                { topic: topic.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const fields = response.data;
            if (!Array.isArray(fields) || fields.length === 0) {
                toast.error("No questions were returned for this topic. Try another topic.");
                setFetchingForm(false);
                return;
            }

            const planDurationField = {
                name: "userPlanDuration",
                label: "How long do you want your learning plan to be? (e.g., 4 weeks, 2 months)",
                type: "text",
                placeholder: "Enter duration in weeks",
                required: true
            };
            setFormFields([...fields, planDurationField]);

            setStarted(true);
            setCurrentQuestion(0);
        } catch (error) {
            console.error("Error fetching form fields:", error?.response?.data || error.message);
            toast.error("Failed to fetch questions. Try again.");
        } finally {
            setFetchingForm(false);
        }
    };

    const handleNext = async () => {
        const fieldName = formFields[currentQuestion].name;
        const isValid = await trigger(fieldName);

        if (isValid) {
            setDirection(1);
            setCurrentQuestion((prev) => Math.min(prev + 1, formFields.length - 1));
        }
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentQuestion((prev) => Math.max(prev - 1, 0));
    };

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You are not logged in. Please log in first.");
                setLoading(false);
                return;
            }

            const payload = {
                topic,
                userQuestionAnswerResponse: {
                    formFields,
                    formValues: data,
                },
            };
            console.log(payload);
            const response = await axios.post(`${BACKENDURL}/plan/generate-plan`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);
            dispatch(setPlan(response.data));
            navigate("/generatedplans");
            toast.success("Plan generated successfully");
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            toast.error("Failed to generate plan");
        } finally {
            setLoading(false);
        }
    };

    if (loading || fetchingForm) {
        return <Loading />;
    }

    if (!started) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4">
                <div className="
        w-full max-w-xl
        bg-slate-900/70 backdrop-blur-xl
        border border-slate-700/40
        rounded-2xl p-8 shadow-2xl
      ">
                    <h1 className="text-2xl font-bold text-blue-400 mb-2">
                        What do you want to learn?
                    </h1>

                    <p className="text-slate-400 mb-6">
                        Tell us the topic and we’ll generate a personalized study plan for you.
                    </p>

                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. DSA, Operating Systems, JavaScript"
                        className="
            w-full rounded-lg px-4 py-3
            bg-slate-800 text-white
            border border-slate-700
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
                    />

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleStart}
                            className="
              bg-blue-600 hover:bg-blue-500
              px-6 py-2 rounded-lg font-semibold
              shadow-lg shadow-blue-600/30
              transition transform hover:scale-105
            "
                        >
                            Start
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    if (!formFields || formFields.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <p className="text-gray-300">No form fields available. Try another topic.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-black"
        >
            <div className="w-full max-w-2xl">

                {/* Progress */}
                <div className="h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500"
                        style={{
                            width: `${((currentQuestion + 1) / formFields.length) * 100}%`,
                        }}
                    />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="relative h-[22rem]">
                        <AnimatePresence custom={direction}>
                            <motion.div
                                key={currentQuestion}
                                custom={direction}
                                variants={questionVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="
                absolute inset-0
                bg-slate-900/70 backdrop-blur-xl
                border border-slate-700/40
                rounded-2xl p-8 shadow-2xl
                flex flex-col justify-center
              "
                            >
                                <h2 className="text-xl font-semibold text-center text-teal-400 mb-6">
                                    {formFields[currentQuestion].label}
                                </h2>

                                {/* INPUT / SELECT */}
                                {formFields[currentQuestion].type === "select" ? (
                                    <select
                                        {...register(formFields[currentQuestion].name, { required: true })}
                                        className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-700"
                                    >
                                        <option value="">Select an option</option>
                                        {formFields[currentQuestion].options.map((o) => (
                                            <option key={o} value={o}>{o}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        {...register(formFields[currentQuestion].name, { required: true })}
                                        placeholder={formFields[currentQuestion].placeholder}
                                        className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-700"
                                    />
                                )}

                                {errors[formFields[currentQuestion].name] && (
                                    <p className="text-red-400 text-sm mt-2">
                                        This field is required
                                    </p>
                                )}

                                {/* Buttons */}
                                <div className="flex justify-between mt-8">
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        disabled={currentQuestion === 0}
                                        className="
                    px-6 py-2 rounded-lg
                    bg-slate-700 hover:bg-slate-600
                    disabled:opacity-50
                  "
                                    >
                                        Back
                                    </button>

                                    {currentQuestion < formFields.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg"
                                        >
                                            Submit
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </form>

                <div className="text-center text-slate-400 mt-4">
                    Question {currentQuestion + 1} of {formFields.length}
                </div>
            </div>
        </motion.div>
    );

};

export default Questionnaire;
