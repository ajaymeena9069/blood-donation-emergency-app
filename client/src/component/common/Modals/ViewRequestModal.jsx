import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaTint, FaUserCircle, FaMapMarkerAlt, FaClock, FaCheckCircle, FaHeartbeat, FaUsers } from "react-icons/fa";

export default function ViewRequestModal({ isOpen, onClose, request }) {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'completed': return 'bg-green-100 text-green-700 border-green-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    if (!request) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`p-6 rounded-t-2xl ${request.emergency ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-blue-600 to-blue-700'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        {request.emergency ? <FaExclamationTriangle className="text-white text-xl" /> : <FaTint className="text-white text-xl" />}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Blood Request Details</h3>
                                        <p className="text-white/80 text-sm">Request ID: {request._id?.slice(-8)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Status Badge */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getStatusStyle(request.status)}`}>
                                    {request.status.toUpperCase()}
                                </span>
                                {request.emergency && (
                                    <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold border-2 border-red-300 flex items-center gap-2">
                                        <FaExclamationTriangle /> EMERGENCY
                                    </span>
                                )}
                            </div>

                            {/* Patient Info */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 mb-4">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <FaUserCircle className="text-blue-600" /> Patient Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">Name</p>
                                        <p className="font-semibold text-gray-900">{request.patientId?.name || request.patientName || 'N/A'}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-medium text-gray-700">{request.patientId?.email || 'N/A'}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="font-medium text-gray-700">{request.patientId?.phone || 'N/A'}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">City</p>
                                        <p className="font-medium text-gray-700">{request.patientId?.city || request.city || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Request Details */}
                            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 mb-4">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <FaTint className="text-red-600" /> Request Details
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="bg-white p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-500 mb-1">Blood Group</p>
                                        <p className="text-2xl font-bold text-red-600">{request.bloodGroup}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-500 mb-1">Units Required</p>
                                        <p className="text-2xl font-bold text-gray-900">{request.units || 'N/A'}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg col-span-2">
                                        <p className="text-xs text-gray-500">Hospital</p>
                                        <p className="font-semibold text-gray-900">{request.hospitalName || 'N/A'}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <FaMapMarkerAlt /> {request.city || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <FaClock className="text-purple-600" /> Timeline
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FaCheckCircle className="text-green-600 text-sm" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Request Created</p>
                                            <p className="text-sm text-gray-500">{new Date(request.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {request.acceptedAt && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FaCheckCircle className="text-blue-600 text-sm" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Request Accepted</p>
                                                <p className="text-sm text-gray-500">{new Date(request.acceptedAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                    {request.completedAt && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FaCheckCircle className="text-purple-600 text-sm" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Request Completed</p>
                                                <p className="text-sm text-gray-500">{new Date(request.completedAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Donor Info */}
                            {request.acceptedBy && (
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 mb-4">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FaHeartbeat className="text-green-600" /> Donor Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">Donor Name</p>
                                            <p className="font-semibold text-gray-900">{request.acceptedBy?.name || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">Contact</p>
                                            <p className="font-medium text-gray-700">{request.acceptedBy?.phone || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="font-medium text-gray-700">{request.acceptedBy?.email || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">Blood Group</p>
                                            <p className="font-bold text-red-600">{request.acceptedBy?.bloodGroup || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Donor Responses */}
                            {request.donorResponses && request.donorResponses.length > 0 && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FaUsers className="text-orange-600" /> Donor Responses ({request.donorResponses.length})
                                    </h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {request.donorResponses.map((response, idx) => (
                                            <div key={idx} className="bg-white p-3 rounded-lg flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">Donor #{idx + 1}</p>
                                                    <p className="text-xs text-gray-500">{response.respondedAt ? new Date(response.respondedAt).toLocaleString() : 'Pending'}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${response.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                        response.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {response.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
                            <button
                                onClick={onClose}
                                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition-all shadow-md"
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