import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSignOutAlt, FaTrashAlt } from "react-icons/fa";

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    icon: Icon = FaSignOutAlt,
    iconBg = "from-red-100 to-red-200",
    iconColor = "text-red-600",
    confirmBg = "from-red-600 to-red-700",
    confirmHoverBg = "from-red-700 to-red-800"
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <div className={`w-20 h-20 bg-gradient-to-br ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <Icon className={`text-3xl ${iconColor}`} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`flex-1 px-4 py-3 bg-gradient-to-r ${confirmBg} text-white rounded-lg hover:bg-gradient-to-r ${confirmHoverBg} font-semibold transition shadow-md`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}