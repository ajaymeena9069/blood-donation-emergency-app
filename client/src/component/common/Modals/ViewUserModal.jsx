import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeartbeat, FaUserMd, FaUserShield, FaUserCircle } from "react-icons/fa";

export default function ViewUserModal({ isOpen, onClose, user }) {
    const getUserRoleIcon = (role) => {
        switch (role) {
            case 'donor': return <FaHeartbeat className="text-red-600 text-2xl" />;
            case 'patient': return <FaUserMd className="text-blue-600 text-2xl" />;
            case 'admin': return <FaUserShield className="text-purple-600 text-2xl" />;
            default: return <FaUserCircle className="text-gray-600 text-2xl" />;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-300';
            case 'blocked': return 'bg-red-100 text-red-700 border-red-300';
            case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    if (!user) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`bg-gradient-to-r ${user.role === 'donor' ? 'from-red-600 to-red-700' :
                                user.role === 'patient' ? 'from-blue-600 to-blue-700' :
                                    'from-purple-600 to-purple-700'
                            } p-6 rounded-t-2xl`}>
                            <h3 className="text-2xl font-bold text-white">User Details</h3>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${user.role === 'donor' ? 'bg-red-100' :
                                        user.role === 'patient' ? 'bg-blue-100' : 'bg-purple-100'
                                    }`}>
                                    {getUserRoleIcon(user.role)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{user.name}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block mt-1 ${getStatusStyle(user.status || 'active')}`}>
                                        {user.status || 'active'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="font-medium text-sm">{user.email}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="font-medium text-sm">{user.phone || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Blood Group</p>
                                    <p className="font-bold text-red-600">{user.bloodGroup || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">City</p>
                                    <p className="font-medium">{user.city || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Age</p>
                                    <p className="font-medium">{user.age || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Gender</p>
                                    <p className="font-medium">{user.gender || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg mt-3">
                                <p className="text-xs text-gray-500">Joined Date</p>
                                <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>

                            {user.role === 'donor' && user.lastDonation && (
                                <div className="bg-green-50 p-3 rounded-lg mt-3">
                                    <p className="text-xs text-gray-500">Last Donation</p>
                                    <p className="font-medium">{new Date(user.lastDonation).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
                            <button
                                onClick={onClose}
                                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 font-semibold transition-all shadow-md"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}