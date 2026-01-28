import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import api from "../../api/axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setLoading(true);
            const response = await api.post(
                `/auth/login`,
                { email, password },
                { withCredentials: true }
            );
            console.log("Login Response:", response.data);

            // Ensure the token is being extracted correctly
            const token = response.data.data.token;
            console.log("Token extracted:", token);

            // Store the token in localStorage
            localStorage.setItem("token", token);
            console.log("Token stored in localStorage:", localStorage.getItem("token")); // Log stored token
            setLoading(false);
            toast.success("Login successful");
            navigate("/dashboard");
        } catch (error) {
            setLoading(false);
            console.error("Login Error:", error.response ? error.response.data : error.message);
            toast.error("Login failed");
        }
    };
    if (loading) {
        return <div><Loading /></div>;
    }
    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#0a0f1a] bg-transparent rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ">
            <div className="w-full max-w-sm p-8 bg-white  shadow-md bg-transparent rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ">
                <h1 className="text-3xl font-bold text-center text-white mb-6">Login</h1>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 text-white py-2 px-2 m-2  focus:ring-2 focus:ring-blue-500 outline-none" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-transparent rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 text-white py-2 px-2 m-2 focus:ring-2 focus:ring-blue-500 outline-none" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleLogin}
                    className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 m-2"
                >
                    Login
                </button>
                <div className="text-white">Dont have account ? <span className="text-blue-300"><Link to="/auth/register">Register</Link></span></div>
            </div>
        </div>

    );
};

export default Login;