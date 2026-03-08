import React from "react";
import { NavLink } from "react-router-dom";
import { FaPlusCircle, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function CreateRequestButton() {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <NavLink to="/patient/create/request" className="flex-1">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl shadow-lg transition-all text-sm"
                >
                    <FaPlusCircle />
                    <span className="font-semibold">Create Blood Request</span>
                </motion.button>
            </NavLink>

            <NavLink to="/patient/create/request?emergency=true" className="flex-1">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-xl shadow-lg transition-all text-sm"
                >
                    <FaExclamationTriangle />
                    <span className="font-semibold">Create Emergency Request</span>
                </motion.button>
            </NavLink>
        </div>
    );
}