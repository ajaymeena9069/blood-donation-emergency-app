/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaHandHoldingHeart, FaTint, FaArrowRight, FaSignInAlt } from "react-icons/fa";

export default function RegisterToggle() {
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    navigate(`/register/${role}`);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-red-100 rounded-full mb-5 shadow-sm">
            <FaTint className="text-4xl text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Welcome to BloodConnect
          </h1>
          <p className="text-gray-600 text-lg">
            Choose how you'd like to join our life-saving community
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Donor Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => handleSelectRole("donor")}
            className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-red-300 transition-all cursor-pointer overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <FaHandHoldingHeart className="text-2xl text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Donor</h3>
                  <p className="text-sm text-gray-500">Give blood, save lives</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Register as a blood donor to help patients in need. Your donation can save up to 3 lives.
              </p>
              
              <div className="flex items-center justify-between mt-6">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
                  Register as Donor
                </button>
                <FaArrowRight className="text-gray-400" />
              </div>
            </div>
            <div className="h-1 bg-red-500"></div>
          </motion.div>

          {/* Patient Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => handleSelectRole("patient")}
            className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaUserMd className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Patient</h3>
                  <p className="text-sm text-gray-500">Request blood, get help</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Register to request blood for yourself or loved ones. Connect with matching donors quickly.
              </p>
              
              <div className="flex items-center justify-between mt-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  Register as Patient
                </button>
                <FaArrowRight className="text-gray-400" />
              </div>
            </div>
            <div className="h-1 bg-blue-500"></div>
          </motion.div>
        </div>

        {/* Login Option */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-gray-100 px-6 py-3 rounded-lg mb-4">
            <FaSignInAlt className="text-gray-600" />
            <span className="text-gray-700">
              Already have an account?{" "}
              <button
                onClick={handleLogin}
                className="text-red-600 hover:text-red-700 font-medium ml-1"
              >
                Login here
              </button>
            </span>
          </div>
          
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Your information is securely stored and only used for matching donors with patients.
          </p>
        </div>
      </motion.div>
    </div>
  );
}