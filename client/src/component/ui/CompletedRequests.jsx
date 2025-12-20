import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useGetPatientRequestsQuery } from '../../features/api/bloodApi';
import { useSelector } from 'react-redux';

export default function CompletedRequests() {
    const { user } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetPatientRequestsQuery(user?.id);

    // ✔ Show only COMPLETED requests
    const completedRequests =
        data?.data?.filter((req) => req.status === "completed") || [];

    // ✔ Dynamic status color classes
    const statusClasses = {
        completed: "bg-green-100 text-green-700 border-green-300",
        accepted: "bg-blue-100 text-blue-700 border-blue-300",
        pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
        cancel: "bg-red-100 text-red-700 border-red-300",
        // rejected: "bg-red-200 text-red-800 border-red-400" // future use
    };

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-screen">

            {/* Header */}
            <div className="mb-8 text-center animate-fadeIn">
                <h1 className="text-4xl font-bold text-gray-800">Completed Requests</h1>
                <p className="text-gray-500 mt-2">
                    All blood requests that have been successfully completed.
                </p>
            </div>

            <NavLink to="/patient/dashboard">
                <button className="flex items-center gap-2 px-4 py-2 
                    bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 
                    transition mb-5 shadow-sm">
                    <FaArrowLeft /> Back
                </button>
            </NavLink>

            {/* Loading */}
            {isLoading && (
                <div className="text-center py-10 animate-pulse text-gray-600 text-lg">
                    Loading completed requests...
                </div>
            )}

            {/* Empty State */}
            {!isLoading && completedRequests.length === 0 && (
                <div className="text-center mt-20 animate-fadeIn">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
                        alt="No Data"
                        className="w-40 mx-auto mb-6 opacity-80"
                    />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                        No Completed Requests
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Your completed donation requests will appear here.
                    </p>
                </div>
            )}

            {/* Requests List */}
            <div className="space-y-5 animate-slideUp">
                {completedRequests.map((req) => (
                    <NavLink to={`${req._id}`} key={req._id}>
                        <div
                            className="
                                bg-white shadow-md border border-gray-200 
                                hover:shadow-xl transition-all duration-300 cursor-pointer 
                                rounded-2xl p-5 flex justify-between items-center
                                hover:-translate-y-1 hover:border-red-300
                            "
                        >
                            {/* LEFT SIDE */}
                            <div>
                                <p className="text-xl font-bold text-red-600">
                                    {req.bloodGroup}
                                </p>

                                <p className="text-gray-700 font-medium">
                                    Hospital: <span className="text-gray-600">{req.hospitalName}</span>
                                </p>

                                <p className="text-gray-700 font-medium capitalize">
                                    City: <span className="text-gray-600">{req.city}</span>
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    Completed On: {new Date(req.updatedAt).toISOString().split("T")[0]}
                                </p>
                            </div>

                            {/* RIGHT STATUS BADGE */}
                            <span
                                className={`
                                    px-4 py-2 rounded-xl text-sm font-semibold 
                                    capitalize shadow-md border
                                    ${statusClasses[req.status] || "bg-gray-100 text-gray-700 border-gray-300"}
                                `}
                            >
                                {req.status}
                            </span>
                        </div>
                    </NavLink>
                ))}
            </div>

            {/* Tips Section */}
            {completedRequests.length > 0 && (
                <div className="mt-12 p-6 bg-red-50 rounded-2xl shadow-md animate-fadeIn">
                    <h3 className="text-xl font-bold text-red-700 mb-3">Tips & Insights</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Completed requests help you track successful donations.</li>
                        <li>Check your active requests for real-time updates.</li>
                        <li>You can download request details from the request page.</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
