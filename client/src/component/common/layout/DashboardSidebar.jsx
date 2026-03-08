import React from "react";
import { motion } from "framer-motion";

export default function DashboardSidebar({ tabs, activeTab, onTabChange }) {
    return (
        <div className="hidden lg:block bg-white rounded-xl border border-gray-200 p-1 mb-6">
            <div className="flex">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${isActive
                                    ? `bg-gradient-to-r ${tab.gradientFrom} ${tab.gradientTo} text-white shadow-md`
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className={isActive ? 'text-white' : `text-${tab.color}-500`} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}