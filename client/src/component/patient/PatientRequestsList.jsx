import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaHeartbeat, FaArrowRight, FaTint, FaMapMarkerAlt,
    FaHospital, FaExclamationTriangle, FaClock
} from "react-icons/fa";

export default function PatientRequestsList({ requests, loading, getStatusConfig, formatDate }) {
    const recentRequests = requests.slice(0, 3);

    return (
        <div className="bg-white rounded-xl border p-4 h-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Recent Blood Requests</h2>
                    <p className="text-gray-600 text-sm">Your recent blood donation requests</p>
                </div>
                <NavLink to="/patient/requests/all" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                    View All <FaArrowRight />
                </NavLink>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 mt-3">Loading requests...</p>
                </div>
            ) : recentRequests.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-300 mb-3">
                        <FaHeartbeat className="text-4xl mx-auto" />
                    </div>
                    <p className="text-gray-500">No requests yet</p>
                    <NavLink to="/patient/create/request" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
                        Create your first request →
                    </NavLink>
                </div>
            ) : (
                <div className="space-y-3">
                    {recentRequests.map(req => {
                        const status = getStatusConfig(req.status);
                        return (
                            <div key={req._id} className={`p-4 rounded-lg border ${status.border} ${status.bg}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${status.badge}`}>
                                                {status.icon} {status.label}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <FaClock className="text-xs" />
                                                {formatDate(req.createdAt)}
                                            </span>
                                            {req.emergency && (
                                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded flex items-center gap-1">
                                                    <FaExclamationTriangle className="text-xs" /> Emergency
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-50 rounded-lg">
                                                    <FaTint className="text-red-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600">Blood Group</p>
                                                    <p className="font-bold text-red-600">{req.bloodGroup}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                    <FaHeartbeat className="text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600">Units</p>
                                                    <p className="font-bold text-gray-900">{req.units}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {(req.hospitalName || req.city) && (
                                            <div className="mt-4 grid grid-cols-2 gap-3">
                                                {req.hospitalName && (
                                                    <div className="flex items-center gap-2">
                                                        <FaHospital className="text-gray-400 text-sm" />
                                                        <p className="text-sm text-gray-700 truncate">{req.hospitalName}</p>
                                                    </div>
                                                )}

                                                {req.city && (
                                                    <div className="flex items-center gap-2">
                                                        <FaMapMarkerAlt className="text-gray-400 text-sm" />
                                                        <p className="text-sm text-gray-700">{req.city}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Donor Response Count */}
                                        {req.donorResponses && req.donorResponses.length > 0 && (
                                            <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-2">
                                                <FaHeartbeat className="text-blue-600 text-xs" />
                                                <p className="text-xs text-blue-700 font-medium">
                                                    {req.donorResponses.length} donor{req.donorResponses.length > 1 ? 's have been' : ' has been'} notified
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <NavLink
                                        to={`/patient/request-details/${req._id}`}
                                        className="text-blue-600 hover:text-blue-700 ml-2 flex items-center gap-1 text-sm font-medium"
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