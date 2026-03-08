// NotFound.jsx
import React, { useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaHeartbeat,
    FaHome,
    FaTint,
    FaArrowLeft,
    FaHospital,
    FaUserMd,
    FaAmbulance,
    FaSearch
} from "react-icons/fa";

export default function NotFound() {
    const navigate = useNavigate();

    // Hide navbar and footer on mount
    useEffect(() => {
        const navbar = document.querySelector('nav');
        const footer = document.querySelector('footer');
        if (navbar) navbar.style.display = 'none';
        if (footer) footer.style.display = 'none';
        return () => {
            if (navbar) navbar.style.display = '';
            if (footer) footer.style.display = '';
        };
    }, []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-20 -right-20 w-64 h-64 bg-red-200 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.15, 0.1],
                        rotate: [360, 180, 0]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-200 rounded-full blur-3xl"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl w-full">
                {/* Blood Drop Animation */}
                <div className="flex justify-center mb-8">
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative"
                    >
                        <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
                            <FaTint className="text-white text-5xl" />
                        </div>
                        <motion.div
                            animate={{
                                y: [0, 30, 0],
                                opacity: [0, 0.5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut"
                            }}
                            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-400 rounded-full blur-sm"
                        />
                    </motion.div>
                </div>

                {/* 404 Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
                        404
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <FaHeartbeat className="text-red-500 text-2xl animate-pulse" />
                        <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
                        <FaHeartbeat className="text-blue-500 text-2xl animate-pulse" />
                    </div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-12"
                >
                    <p className="text-xl text-gray-600 mb-2">
                        Oops! The page you're looking for seems to have lost its way.
                    </p>
                    <p className="text-gray-500">
                        Just like blood, we need to keep things flowing in the right direction.
                    </p>
                </motion.div>

                {/* Quick Links Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
                >
                    <NavLink to="/">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-red-100 hover:border-red-500 group"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <FaHome className="text-white text-2xl" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1">Go Home</h3>
                                <p className="text-sm text-gray-500">Return to safety</p>
                            </div>
                        </motion.div>
                    </NavLink>

                    <NavLink to="/donor/dashboard">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-blue-100 hover:border-blue-500 group"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <FaHeartbeat className="text-white text-2xl" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1">Donor Dashboard</h3>
                                <p className="text-sm text-gray-500">Check your matches</p>
                            </div>
                        </motion.div>
                    </NavLink>

                    <NavLink to="/patient/dashboard">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-purple-100 hover:border-purple-500 group"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <FaUserMd className="text-white text-2xl" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1">Patient Dashboard</h3>
                                <p className="text-sm text-gray-500">Manage requests</p>
                            </div>
                        </motion.div>
                    </NavLink>
                </motion.div>

                {/* Search or Go Back */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium flex items-center gap-2 group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>

                    <NavLink to="/">
                        <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-xl hover:from-red-700 hover:to-blue-700 transition-all font-medium flex items-center gap-2 shadow-lg hover:shadow-xl">
                            <FaHospital />
                            Return to Home
                        </button>
                    </NavLink>
                </motion.div>

                {/* Help Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-12"
                >
                    <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                        <FaAmbulance className="text-red-400" />
                        Need help? Contact our support team
                        <FaHeartbeat className="text-blue-400" />
                    </p>
                </motion.div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 left-10 opacity-20 hidden lg:block">
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <FaHeartbeat className="text-red-600 text-6xl" />
                    </motion.div>
                </div>

                <div className="absolute bottom-1/4 right-10 opacity-20 hidden lg:block">
                    <motion.div
                        animate={{
                            rotate: [360, 0],
                            scale: [1, 1.3, 1]
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <FaHospital className="text-blue-600 text-6xl" />
                    </motion.div>
                </div>
            </div>

            {/* Footer Note */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-4 text-center text-gray-400 text-sm"
            >
                <p>© 2024 Blood Donation Management System. Every drop counts.</p>
            </motion.div>
        </div>
    );
}