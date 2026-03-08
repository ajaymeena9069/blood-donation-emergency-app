import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function UpdateStatusModal({ isOpen, onClose, onUpdate, request, isLoading }) {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (request) {
            setSelectedStatus(request.status);
            setRejectionReason('');
        }
    }, [request]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-500';
            case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-500';
            case 'completed': return 'bg-green-100 text-green-700 border-green-500';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-500';
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
                        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 sm:p-6 rounded-t-2xl flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <FaEdit className="text-white text-lg sm:text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white">Update Request Status</h3>
                                        <p className="text-purple-100 text-xs sm:text-sm hidden sm:block">Change the status of this blood request</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                            {/* Current Status */}
                            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                                <p className="text-xs sm:text-sm text-gray-500 mb-2">Current Status</p>
                                <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold border-2 inline-block ${getStatusStyle(request.status)}`}>
                                    {request.status.toUpperCase()}
                                </span>
                            </div>

                            {/* Request Info */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Patient</p>
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{request.patientId?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Blood Group</p>
                                        <p className="font-bold text-red-600 text-base sm:text-lg">{request.bloodGroup}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Options */}
                            <div>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-3">Select New Status</p>
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    {['pending', 'accepted', 'completed', 'rejected'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setSelectedStatus(status)}
                                            className={`px-3 sm:px-4 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all border-2 ${selectedStatus === status
                                                    ? status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700 border-yellow-500'
                                                        : status === 'accepted'
                                                            ? 'bg-blue-100 text-blue-700 border-blue-500'
                                                            : status === 'completed'
                                                                ? 'bg-green-100 text-green-700 border-green-500'
                                                                : 'bg-red-100 text-red-700 border-red-500'
                                                    : 'bg-gray-50 text-gray-600 border-gray-300 hover:border-purple-400'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>

                                {/* Rejection Reason */}
                                {selectedStatus === 'rejected' && (
                                    <div className="mt-4">
                                        <label className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 block">
                                            Rejection Reason *
                                        </label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Please provide a reason for rejection (minimum 10 characters)..."
                                            className="w-full p-2 sm:p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none text-sm"
                                            rows="3"
                                        />
                                        {rejectionReason.length > 0 && rejectionReason.length < 10 && (
                                            <p className="text-red-600 text-xs mt-1">
                                                Need {10 - rejectionReason.length} more characters
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 rounded-b-2xl flex gap-2 sm:gap-3 flex-shrink-0">
                            <button
                                onClick={onClose}
                                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (selectedStatus === 'rejected') {
                                        if (rejectionReason.trim().length < 10) return;
                                        onUpdate(selectedStatus, rejectionReason);
                                    } else {
                                        onUpdate(selectedStatus);
                                    }
                                }}
                                disabled={isLoading || selectedStatus === request.status || (selectedStatus === 'rejected' && rejectionReason.trim().length < 10)}
                                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 font-semibold transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                            >
                                {isLoading ? (
                                    <><FaSpinner className="animate-spin" /> Updating...</>
                                ) : (
                                    <><FaCheckCircle /> Confirm Update</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}