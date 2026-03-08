import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrashAlt } from "react-icons/fa";

export default function BulkDeleteModal({ isOpen, onClose, onConfirm, count, type }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTrashAlt className="text-3xl text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Bulk Delete Confirmation</h3>
                            <p className="text-gray-600 mb-2">
                                Are you sure you want to delete <span className="font-semibold text-red-600">{count}</span> {type}?
                            </p>
                            <p className="text-sm text-red-600 mb-6">
                                This action cannot be undone. All data will be permanently removed.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 font-semibold transition shadow-md flex items-center justify-center gap-2"
                                >
                                    <FaTrashAlt /> Delete All
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}