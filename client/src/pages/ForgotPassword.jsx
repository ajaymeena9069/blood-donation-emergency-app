import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTint, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import FlashMessage from "../component/FlashMessage";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [flash, setFlash] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setFlash({ type: "error", message: "Please enter your email" });
            return;
        }

        setIsLoading(true);
        
        try {
            const API_URL = import.meta.env.VITE_API_URL || "https://blood-donation-emergency-app.onrender.com/api";
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setFlash({ type: "success", message: "Password reset link sent to your email!" });
                setEmail("");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setFlash({ type: "error", message: data.message || "Failed to send reset link" });
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
                    <button
                        onClick={() => navigate("/login")}
                        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <FaArrowLeft /> Back to Login
                    </button>

                    <div className="text-center mb-8">
                        <div className="mb-4">
                            <div className="inline-flex items-center gap-2 p-3 bg-red-50 rounded-full">
                                <FaTint className="text-2xl text-red-600" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Forgot Password?</h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Enter your email to receive a password reset link
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Email *</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-sm" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition bg-white"
                                    />
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
                                        Sending...
                                    </span>
                                ) : (
                                    "Send Reset Link"
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
                            🔒 Your information is securely encrypted
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
