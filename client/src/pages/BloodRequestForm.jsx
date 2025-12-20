/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCreateRequestMutation, useCreateNotificationMutation } from "../features/api/bloodApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTint, FaHospital, FaCity, FaExclamationTriangle, FaPaperPlane } from "react-icons/fa";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function BloodRequestForm() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [createBloodRequest, { isLoading, error, isError }] = useCreateRequestMutation();
  const [createNotification] = useCreateNotificationMutation();

  const [formData, setFormData] = useState({
    patientId: user?.id || "",
    bloodGroup: "",
    units: 1,
    city: "",
    hospitalName: "",
    emergency: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : name === "units"
          ? Math.max(1, Number(value))
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("User not found! Please login again.");
      return;
    }

    if (!formData.bloodGroup) {
      alert("Please select a blood group.");
      return;
    }

    try {
      const result = await createBloodRequest(formData).unwrap();

      await createNotification({
        userId: user?.id,
        title: "Blood Request Created",
        message: `Your blood request for ${formData.bloodGroup} has been submitted successfully.`,
        type: "info",
      });

      alert("Blood request created successfully!");
      navigate("/patient/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-red-50 to-white py-8 px-4"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-8 border-red-600"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Blood Request
          </h1>
          <p className="text-gray-600">
            Fill in the details below to request blood. We'll notify matching donors immediately.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full">
                <FaTint className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Request Details</h2>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Blood Group */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <FaTint className="text-red-500" />
                Blood Group *
              </label>
              <div className="relative">
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none appearance-none"
                  required
                >
                  <option value="">Select your blood group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg} className="py-2">
                      {bg}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Units Required */}
            <div className="space-y-2">
              <label className="text-gray-700 font-medium">Units Required *</label>
              <div className="flex items-center">
              <input
                type="number"
                name="units"
                min="1"
                max="10"
                value={formData.units}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none"
                placeholder="Number of units"
                required
              />
              <span className="ml-3 text-gray-500 font-medium">units</span>
              </div>
              <p className="text-xs text-gray-500">Typically 1 unit = 450ml of blood</p>
            </div>

            {/* City and Hospital Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaCity className="text-red-500" />
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none"
                  placeholder="Enter city name"
                  required
                />
              </div>

              {/* Hospital Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaHospital className="text-red-500" />
                  Hospital Name *
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none"
                  placeholder="Hospital name"
                  required
                />
              </div>
            </div>

            {/* Emergency Checkbox */}
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="emergency"
                  checked={formData.emergency}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-red-600 focus:ring-red-500 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FaExclamationTriangle className="text-red-600" />
                    <span className="font-semibold text-red-700">Emergency Request</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Check this if this is an urgent requirement. Emergency requests get priority matching.
                  </p>
                </div>
                {formData.emergency && (
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
                    URGENT
                  </span>
                )}
              </label>
            </div>

            {/* Error Message */}
            {isError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="text-red-600 mt-0.5">⚠️</div>
                  <div>
                    <p className="font-medium text-red-700">Submission Failed</p>
                    <p className="text-sm text-red-600 mt-1">
                      {error?.data?.message || "Something went wrong. Please try again."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Request...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Submit Blood Request</span>
                  </>
                )}
              </motion.button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Your request will be sent to matching donors in your city.
              </p>
            </div>
          </form>
        </motion.div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate(-1)}
          className="mt-6 text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </motion.button>
      </div>
    </motion.div>
  );
}