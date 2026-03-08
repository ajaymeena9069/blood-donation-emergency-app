import React from "react";
import { motion } from "framer-motion";

export default function StatCard({ title, value, subValue, icon: Icon, gradient, delay = 0, onClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-all hover:scale-105 group ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform`}>
                    <Icon className="text-white text-sm sm:text-base" />
                </div>
            </div>
            {subValue && <p className="text-xs text-gray-500 mt-2 truncate">{subValue}</p>}
        </motion.div>
    );
}