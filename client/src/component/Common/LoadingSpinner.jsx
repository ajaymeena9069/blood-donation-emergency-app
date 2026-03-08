import React from "react";
import { motion } from "framer-motion";
import { FaHeartbeat, FaTint } from "react-icons/fa";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-red-200 border-t-red-600 rounded-full"
          />
          
          {/* Inner pulsing heart */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FaHeartbeat className="text-3xl text-red-600" />
          </motion.div>

          {/* Blood drops animation */}
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
          >
            <FaTint className="text-red-400 text-sm" />
          </motion.div>
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-gray-700 font-medium text-lg"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}
