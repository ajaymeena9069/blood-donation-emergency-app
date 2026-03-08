import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle, FaHistory, FaClock, FaArrowRight } from "react-icons/fa";

export default function DonorProfileCard({
    user,
    lastDonation,
    getNextEligibleDate,
    formatDate,
    handleResetTimer,
    isResetting
}) {
    return (
        <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 mb-3">
                <FaUserCircle className="text-red-600" />
                <h3 className="font-bold text-gray-900">Donor Profile</h3>
            </div>
            <div className="space-y-3">
                <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Blood Group</p>
                    <p className="text-2xl font-bold text-red-700">{user?.bloodGroup || "N/A"}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-gray-50 border rounded">
                        <p className="text-xs text-gray-600">Total Donations</p>
                        <p className="font-bold text-gray-900">{user?.totalDonations || 0}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 border rounded">
                        <p className="text-xs text-gray-600">Availability</p>
                        <p className={`text-sm font-medium ${user?.available ? 'text-green-600' : 'text-red-600'}`}>
                            {user?.available ? 'Available' : 'Not Available'}
                        </p>
                    </div>
                </div>

                {user?.lastDonationDate && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <FaHistory className="text-yellow-600 text-sm" />
                            <p className="text-xs text-gray-600">Last Donation</p>
                        </div>
                        <p className="font-medium text-gray-900">{formatDate(user.lastDonationDate)}</p>
                    </div>
                )}

                {!user?.available && user?.status === 'inactive' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <FaClock className="text-blue-600 text-sm" />
                            <p className="text-xs text-gray-600">Availability Status</p>
                        </div>
                        <p className="font-medium text-red-600 mb-2">Currently Not Available</p>
                        {user?.nextEligibleDate && (
                            <>
                                <p className="text-xs text-gray-600 mb-1">Next Eligible Date</p>
                                <p className="text-sm font-medium text-blue-600 mb-2">
                                    {formatDate(user.nextEligibleDate)}
                                </p>
                            </>
                        )}
                        <button
                            onClick={handleResetTimer}
                            disabled={isResetting}
                            className="w-full mt-2 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded font-medium transition disabled:opacity-50"
                        >
                            {isResetting ? "Resetting..." : "🔄 Reset Availability (Dev)"}
                        </button>
                    </div>
                )}

                <NavLink to="/donor/profile">
                    <button className="w-full mt-1 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm">
                        Edit Profile <FaArrowRight />
                    </button>
                </NavLink>
            </div>
        </div>
    );
}