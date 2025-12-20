/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaUserInjured, FaUserMd, FaUserShield } from "react-icons/fa";

export default function LoginOptions() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Login as Patient",
      icon: <FaUserInjured size={40} />,
      color: "bg-red-500 hover:bg-red-600",
      route: "/login/patient",
    },
    {
      title: "Login as Donor",
      icon: <FaUserMd size={40} />,
      color: "bg-blue-500 hover:bg-blue-600",
      route: "/login/donor",
    },
    {
      title: "Login as Admin",
      icon: <FaUserShield size={40} />,
      color: "bg-gray-800 hover:bg-gray-900",
      route: "/login/admin",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Choose Your Login Type
        </h1>

        <div className="space-y-5">
          {options.map((opt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <button
                onClick={() => navigate(opt.route)}
                className={`w-full flex items-center justify-center gap-4 text-white py-3 rounded-xl font-semibold text-lg shadow-md transition-all ${opt.color}`}
              >
                {opt.icon}
                {opt.title}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
