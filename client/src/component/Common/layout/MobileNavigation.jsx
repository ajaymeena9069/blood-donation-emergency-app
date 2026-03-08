import React from "react";
import { motion } from "framer-motion";

export default function MobileNavigation({ tabs, activeTab, onTabChange, gradientFrom = "from-red-600", gradientTo = "to-red-700" }) {
    if (!tabs || tabs.length === 0) return null;
    
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 shadow-lg">
            <div className="grid grid-cols-4 gap-1 px-2 py-2">
                {tabs.map((tab) => {
                    const Icon = tab.mobileIcon || tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all active:scale-95 ${
                                isActive ? `bg-${tab.color}-50` : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className={`relative transition-transform ${
                                isActive ? 'scale-110' : 'hover:scale-105'
                            }`}>
                                <Icon className={`text-xl mb-1 transition-colors ${
                                    isActive ? `text-${tab.color}-600` : 'text-gray-500'
                                }`} />
                            </div>
                            <span className={`text-xs font-medium transition-colors ${
                                isActive ? `text-${tab.color}-600` : 'text-gray-600'
                            }`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}