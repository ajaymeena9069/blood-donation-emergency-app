/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaUserInjured, FaUserMd, FaUserShield, FaSignInAlt, FaTint } from "react-icons/fa";

export default function LoginOptions() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Patient Login",
      description: "Access patient dashboard",
      icon: <FaUserInjured />,
      color: "border-red-200 hover:border-red-300",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      route: "/login/patient",
    },
    {
      title: "Donor Login",
      description: "Access donor dashboard",
      icon: <FaUserMd />,
      color: "border-blue-200 hover:border-blue-300",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      route: "/login/donor",
    },
    {
      title: "Admin Login",
      description: "Access admin panel",
      icon: <FaUserShield />,
      color: "border-gray-200 hover:border-gray-300",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      route: "/login/admin",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome Back</h2>
          <p className="text-gray-600">
            Select your role to continue to login
          </p>
        </div>

        {/* Login Options Cards */}
        <div className="space-y-4 mb-8">
          {options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(option.route)}
              className={`w-full bg-white rounded-xl border ${option.color} shadow-sm hover:shadow-md p-5 flex items-center gap-4 transition-all duration-200`}
            >
              {/* Icon */}
              <div className={`${option.iconBg} ${option.iconColor} p-3 rounded-lg`}>
                <div className="text-xl">{option.icon}</div>
              </div>
              
              {/* Text Content */}
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-800 text-lg">{option.title}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
              
              {/* Arrow */}
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center space-y-4">
          {/* Register Link */}
          <div>
            <p className="text-gray-600 mb-2">New to BloodConnect?</p>
            <button
              onClick={() => navigate("/register")}
              className="w-full py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition shadow-sm"
            >
              Create New Account
            </button>
          </div>

          {/* Back to Home */}
          <div>
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-1 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-400 pt-4 border-t border-gray-200">
            Secure login with encrypted credentials
          </p>
        </div>
      </div>
    </div>
  );
}