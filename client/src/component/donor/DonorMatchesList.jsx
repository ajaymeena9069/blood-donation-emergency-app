import React from "react";
import { NavLink } from "react-router-dom";
import { FaHeartbeat, FaArrowRight, FaTint, FaMapMarkerAlt, FaHospital, FaBell } from "react-icons/fa";

export default function DonorMatchesList({ matches, loading, getStatusConfig, formatDate }) {
    const recentMatches = matches.slice(0, 3);

    return (
        <div className="bg-white rounded-xl border p-4 h-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Recent Blood Requests</h2>
                    <p className="text-gray-600 text-sm">Blood requests matching your profile</p>
                </div>
                <NavLink to="/donor/matches?status=all" className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                    View All <FaArrowRight />
                </NavLink>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 mt-3">Loading matches...</p>
                </div>
            ) : recentMatches.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-300 mb-3">
                        <FaHeartbeat className="text-4xl mx-auto" />
                    </div>
                    <p className="text-gray-500">No matches yet</p>
                    <p className="text-sm text-gray-500 mt-1">Blood requests matching your profile will appear here</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {recentMatches.map(match => {
                        const status = getStatusConfig(match.status);
                        return (
                            <div key={match._id} className={`p-4 rounded-lg border ${status.border} ${status.bg}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${status.badge}`}>
                                                {status.icon} {status.label}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(match.createdAt)}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex items-center gap-2">
                                                    <FaTint className="text-red-500 text-sm" />
                                                    <div>
                                                        <p className="text-xs text-gray-600">Blood Group</p>
                                                        <p className="font-bold text-red-600">{match.bloodGroup}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <FaHeartbeat className="text-blue-500 text-sm" />
                                                    <div>
                                                        <p className="text-xs text-gray-600">Units Needed</p>
                                                        <p className="font-bold text-gray-900">{match.units}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {match.patient?.city && (
                                                    <div className="flex items-center gap-2">
                                                        <FaMapMarkerAlt className="text-gray-500 text-sm" />
                                                        <div>
                                                            <p className="text-xs text-gray-600">Location</p>
                                                            <p className="text-sm font-medium text-gray-800">{match.patient.city}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {match.hospital && (
                                                    <div className="flex items-center gap-2">
                                                        <FaHospital className="text-gray-500 text-sm" />
                                                        <div>
                                                            <p className="text-xs text-gray-600">Hospital</p>
                                                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{match.hospital}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {match.status === "pending" && (
                                                <div className="mt-3">
                                                    <p className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 rounded p-2">
                                                        <FaBell className="inline mr-1" />
                                                        Check matching requests to respond to this request
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <NavLink
                                        to={`/donor/matching-requests/${match._id}`}
                                        className="text-red-600 hover:text-red-700 ml-2 flex items-center gap-1 text-sm font-medium"
                                    >
                                        Details <FaArrowRight />
                                    </NavLink>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}