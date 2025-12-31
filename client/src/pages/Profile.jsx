import axios from 'axios';
import React, { useEffect } from 'react'
import { BACKENDURL } from '../App';

export default function Profile() {

    const [profileData, setProfileData] = React.useState(null);

    useEffect(() => {
        const fetchprofile = async () => {
            try {
                const user = await axios.get(`${BACKENDURL}/auth/userinfo`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                console.log(user);
                setProfileData(user.data.user);
            } catch (error) {
                console.log("Error fetching profile data:", error);
            }
        }
        fetchprofile();
    }, [])

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6">
                <div className="
        w-full max-w-md
        bg-slate-900/70 backdrop-blur-xl
        rounded-3xl
        shadow-[0_30px_80px_rgba(0,0,0,0.7)]
        border border-slate-700/40
        p-8
        animate-fadeIn
      ">

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

                            {/* Profile Title */}
                            <h1 className="text-3xl font-bold text-center text-white mb-1">
                                {profileData.name}
                            </h1>
                            <p className="text-center text-slate-400 mb-8">
                                User Profile
                            </p>

                            {/* Profile Details */}
                            <div className="space-y-5">
                                <div className="flex justify-between items-center border-b border-slate-700/40 pb-3">
                                    <p className="text-slate-400 text-sm">Name</p>
                                    <p className="text-white font-medium">{profileData.name}</p>
                                </div>

                                <div className="flex justify-between items-center border-b border-slate-700/40 pb-3">
                                    <p className="text-slate-400 text-sm">Email</p>
                                    <p className="text-white font-medium">{profileData.email}</p>
                                </div>

                                <div className="flex justify-between items-center border-b border-slate-700/40 pb-3">
                                    <p className="text-slate-400 text-sm">Organization</p>
                                    <p className="text-white font-medium">{profileData.organization}</p>
                                </div>

                                <div className="flex justify-between items-center pb-1">
                                    <p className="text-slate-400 text-sm">Role</p>
                                    <p className="text-white font-medium">{profileData.role}</p>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <div className="mt-10 flex justify-center">
                                <button
                                    className="
                  px-8 py-3 rounded-xl
                  bg-indigo-600 hover:bg-indigo-500
                  transition
                  text-white font-semibold
                  shadow-lg shadow-indigo-600/30
                  transform hover:scale-105
                "
                                >
                                    Edit Profile
                                </button>
                            </div>

                        </>
                    ) : (
                        <p className="text-slate-400 text-center animate-pulse">
                            Loading profile…
                        </p>
                    )}
                </div>
            </div>
        </>
    );

}
