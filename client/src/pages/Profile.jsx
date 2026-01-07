import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BACKENDURL } from '../App';

export default function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        organization: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchprofile = async () => {
            try {
                const user = await axios.get(`${BACKENDURL}/auth/userinfo`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProfileData(user.data.user);
                setFormData({
                    name: user.data.user.name,
                    organization: user.data.user.organization
                });
            } catch (error) {
                console.log("Error fetching profile data:", error);
            }
        };
        fetchprofile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const res = await axios.put(
                `${BACKENDURL}/auth/edituser`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setProfileData(res.data.user);
            setEditMode(false);
        } catch (error) {
            console.log("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6">
            <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.7)] border border-slate-700/40 p-8">

                {profileData ? (
                    <>
                        {/* Avatar */}
                        <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white">
                                        {profileData.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-center text-white mb-6">
                            {editMode ? "Edit Profile" : profileData.name}
                        </h1>

                        {/* Profile Details */}
                        <div className="space-y-5">
                            {/* Name */}
                            <div className="flex justify-between items-center border-b border-slate-700/40 pb-3">
                                <p className="text-slate-400 text-sm">Name</p>
                                {editMode ? (
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="bg-slate-800 text-white px-3 py-1 rounded-lg outline-none"
                                    />
                                ) : (
                                    <p className="text-white font-medium">{profileData.name}</p>
                                )}
                            </div>

                            {/* Email (Read Only) */}
                            <div className="flex justify-between items-center border-b border-slate-700/40 pb-3">
                                <p className="text-slate-400 text-sm">Email</p>
                                <p className="text-white font-medium">{profileData.email}</p>
                            </div>

                            {/* Organization */}
                            <div className="flex justify-between items-center border-b border-slate-700/40 pb-3">
                                <p className="text-slate-400 text-sm">Organization</p>
                                {editMode ? (
                                    <input
                                        name="organization"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        className="bg-slate-800 text-white px-3 py-1 rounded-lg outline-none"
                                    />
                                ) : (
                                    <p className="text-white font-medium">
                                        {profileData.organization}
                                    </p>
                                )}
                            </div>

                            {/* Role */}
                            <div className="flex justify-between items-center">
                                <p className="text-slate-400 text-sm">Role</p>
                                <p className="text-white font-medium">{profileData.role}</p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-10 flex justify-center gap-4">
                            {editMode ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition"
                                    >
                                        {loading ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        onClick={() => setEditMode(false)}
                                        className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition transform hover:scale-105"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <p className="text-slate-400 text-center animate-pulse">
                        Loading profile…
                    </p>
                )}
            </div>
        </div>
    );
}
