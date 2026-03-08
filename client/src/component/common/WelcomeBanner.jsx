import React from "react";
import { motion } from "framer-motion";

export default function WelcomeBanner({ 
  userName, 
  message, 
  icon: Icon, 
  gradientFrom = "from-red-600", 
  gradientTo = "to-red-700",
  iconColor = "text-red-300"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl p-6 text-white shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {userName}! 👋
          </h2>
          <p className="text-white/90">{message}</p>
        </div>
        {Icon && (
          <div className="hidden sm:block">
            <Icon className={`text-6xl ${iconColor} opacity-50`} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
