import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle, FaMapMarkerAlt, FaCalendarAlt, FaArrowRight } from "react-icons/fa";

export default function PatientProfileCard({ user }) {
    return (
        <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 mb-3">
                <FaUserCircle className="text-blue-600" />
                <h3 className="font-bold text-gray-900">Patient Profile</h3>
            </div>
            <div className="space-y-3">
                <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Blood Group</p>
                    <p className="text-2xl font-bold text-blue-700">{user?.bloodGroup || "N/A"}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-gray-50 border rounded">
                        <p className="text-xs text-gray-600">Age</p>
                        <p className="font-bold text-gray-900">{user?.age || "N/A"}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 border rounded">
                        <p className="text-xs text-gray-600">Gender</p>
                        <p className="font-medium text-gray-800">{user?.gender || "N/A"}</p>
                    </div>
                </div>

                {user?.city && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <FaMapMarkerAlt className="text-gray-500" />
                        <span className="text-sm text-gray-700">{user.city}</span>
                    </div>
                )}

                {user?.createdAt && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <FaCalendarAlt className="text-gray-500" />
                        <span className="text-sm text-gray-700">
                            Member since {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                )}

                <NavLink to="/patient/profile">
                    <button className="w-full mt-1 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm">
                        Edit Profile <FaArrowRight />
                    </button>
                </NavLink>
            </div>
        </div>
    );
}