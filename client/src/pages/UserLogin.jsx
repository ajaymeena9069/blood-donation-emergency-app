/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTint, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useLoginUserMutation } from "../features/api/bloodApi";
import FlashMessage, { getMessage } from "../component/FlashMessage";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";

export default function UserLogin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [flash, setFlash] = useState({ type: "", message: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loginUser, { isLoading }] = useLoginUserMutation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setFlash({ type: "error", message: "Please fill in all fields" });
            return;
        }

        try {
            const res = await loginUser(formData).unwrap();
            let userRole = null;
            
            if (res.user && res.user.role) {
                userRole = Array.isArray(res.user.role) ? res.user.role[0] : res.user.role;
            } else if (res.role) {
                userRole = Array.isArray(res.role) ? res.role[0] : res.role;
            }
            
            
            dispatch(setCredentials({
                token: res.token,
                role: userRole,
                user: res.user
            }));

            setFlash({ type: "success", message: "Login successful!" });

            setTimeout(() => {
                if (userRole === "donor") {
                    navigate("/donor/dashboard");
                } else if (userRole === "patient") {
                    navigate("/patient/dashboard");
                } else if (userRole === "admin") {
                    navigate("/admin/dashboard");
                } else {
                    console.warn("No valid role found, navigating to /dashboard");
                    navigate("/dashboard"); // Default fallback
                }
            }, 500);

        } catch (error) {
            console.error("Login error:", error);
            setFlash({
                type: "error",
                message: error?.data?.message || "Invalid credentials"
            });
        }
    };

    const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition bg-white";

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            {/* Flash Message Component */}
            <FlashMessage
                type={flash.type}
                message={flash.message}
                onClose={() => setFlash({ type: "", message: "" })}
            />

            <div className="max-w-md mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mb-4">
                        <div className="inline-flex items-center gap-2 p-3 bg-red-50 rounded-full">
                            <FaTint className="text-2xl text-red-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-600 text-sm mt-1">Sign in to your account</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Email *</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-sm" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className={inputClass}
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Password *</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-3 text-gray-400 text-sm" />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className={inputClass}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
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

                        {/* Forgot Password */}
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                                className="text-sm text-red-600 hover:text-red-700"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-lg font-medium text-white mt-2 bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="my-6">
                        <div className="flex items-center">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <span className="px-4 text-gray-500 text-sm">or</span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                        </div>
                    </div>

                    {/* Register Link */}
                    <div className="text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{" "}
                            <button
                                onClick={() => navigate("/register")}
                                className="text-red-600 hover:text-red-700 font-medium"
                            >
                                Register now
                            </button>
                        </p>
                    </div>
                </div>

                {/* Security Note */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        🔒 Your login information is securely encrypted
                    </p>
                </div>
            </div>
        </div>
    );
}