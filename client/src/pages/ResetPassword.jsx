import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTint, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import FlashMessage from "../component/FlashMessage";

export default function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [flash, setFlash] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!password || !confirmPassword) {
            setFlash({ type: "error", message: "Please fill all fields" });
            return;
        }

        if (password.length < 6) {
            setFlash({ type: "error", message: "Password must be at least 6 characters" });
            return;
        }

        if (password !== confirmPassword) {
            setFlash({ type: "error", message: "Passwords do not match" });
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.success) {
                setFlash({ type: "success", message: "Password reset successful! Redirecting to login..." });
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setFlash({ type: "error", message: data.message || "Failed to reset password" });
            }
        } catch (error) {
            setFlash({ type: "error", message: "Network error. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <FlashMessage flash={flash} setFlash={setFlash} />
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <div className="mb-4">
                            <div className="inline-flex items-center gap-2 p-3 bg-red-50 rounded-full">
                                <FaTint className="text-2xl text-red-600" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Enter your new password
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">New Password *</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-3 text-gray-400 text-sm" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition bg-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Confirm Password *</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-3 text-gray-400 text-sm" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition bg-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-lg font-medium text-white mt-2 bg-red-600 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Resetting...
                                    </span>
                                ) : (
                                    "Reset Password"
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Remember your password?{" "}
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-red-600 hover:text-red-700 font-medium"
                                >
                                    Login here
                                </button>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            🔒 Your password is securely encrypted
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
