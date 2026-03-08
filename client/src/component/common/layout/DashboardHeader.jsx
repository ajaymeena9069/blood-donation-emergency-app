import React, { useState } from "react";
import { FaHome, FaSpinner, FaSignOutAlt, FaBars, FaUserShield, FaHeartbeat, FaHospital, FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';

export default function DashboardHeader({
    title,
    subtitle,
    icon: Icon,
    gradientFrom,
    gradientTo,
    notificationCount = 0,
    onRefresh,
    onLogout,
    onNotificationClick,
    userRole
}) {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const getIcon = () => {
        if (Icon) return Icon;
        if (title.includes('Admin')) return FaUserShield;
        if (title.includes('Donor')) return FaHeartbeat;
        return FaHospital;
    };

    const HeaderIcon = getIcon();

    return (
        <>
            {/* Desktop Header */}
            <div className={`hidden md:block bg-gradient-to-r ${gradientFrom} ${gradientTo} shadow-lg sticky top-0 z-10`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                                <HeaderIcon className="text-white text-xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {title}
                                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-normal">
                                        Blood Donation
                                    </span>
                                </h1>
                                <p className="text-sm text-white/80">{subtitle}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="p-2.5 text-white hover:bg-white/20 rounded-lg transition-colors relative group"
                                title="Home"
                            >
                                <FaHome className="text-lg" />
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                                    Go to Home
                                </span>
                            </button>

                            {userRole === 'admin' ? (
                                <button
                                    onClick={() => {
                                        onRefresh?.();
                                        toast.success('Dashboard refreshed successfully!');
                                    }}
                                    className="p-2.5 text-white hover:bg-white/20 rounded-lg transition-colors relative group"
                                    title="Refresh"
                                >
                                    <FaSpinner className="text-lg" />
                                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                        Refresh Data
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={onNotificationClick}
                                    className="p-2.5 text-white hover:bg-white/20 rounded-lg transition-colors relative"
                                    title="Notifications"
                                >
                                    <FaBell className="text-lg" />
                                    {notificationCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-gray-900 font-bold">
                                            {notificationCount > 9 ? '9+' : notificationCount}
                                        </span>
                                    )}
                                </button>
                            )}

                            {userRole === 'admin' && notificationCount > 0 && (
                                <div className="relative">
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                                        {notificationCount > 9 ? '9+' : notificationCount}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium text-sm"
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className={`md:hidden bg-gradient-to-r ${gradientFrom} ${gradientTo} shadow-lg sticky top-0 z-10`}>
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <HeaderIcon className="text-white text-lg" />
                        </div>
                        <h1 className="text-lg font-bold text-white">{title.split(' ')[0]}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {userRole === 'admin' ? (
                            <button
                                onClick={() => {
                                    onRefresh?.();
                                    toast.success('Refreshed!');
                                }}
                                className="p-2 text-white relative"
                            >
                                <FaSpinner className="text-lg" />
                            </button>
                        ) : (
                            <button
                                onClick={onNotificationClick}
                                className="p-2 text-white relative"
                            >
                                <FaBell className="text-lg" />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-gray-900 font-bold">
                                        {notificationCount > 9 ? '9+' : notificationCount}
                                    </span>
                                )}
                            </button>
                        )}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="p-2 text-white"
                        >
                            <FaBars className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-white/20"
                        >
                            <div className="px-4 py-2 space-y-1">
                                <button
                                    onClick={() => {
                                        window.location.href = '/';
                                        setShowMobileMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg flex items-center gap-3"
                                >
                                    <FaHome /> Home
                                </button>
                                <button
                                    onClick={() => {
                                        onLogout();
                                        setShowMobileMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg flex items-center gap-3"
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}