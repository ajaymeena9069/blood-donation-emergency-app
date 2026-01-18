/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCreateRequestMutation } from "../features/api/bloodApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTint, FaHospital, FaMapMarkerAlt, FaExclamationTriangle, FaPaperPlane, FaArrowLeft } from "react-icons/fa";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function BloodRequestForm() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [createBloodRequest, { isLoading }] = useCreateRequestMutation();

  const [formData, setFormData] = useState({
    bloodGroup: "",
    units: 1,
    city: user?.city || "",
    hospitalName: "",
    emergency: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : name === "units" ? Math.max(1, Number(value)) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bloodGroup || !formData.city || !formData.hospitalName) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await createBloodRequest({ ...formData, patientId: user?.id }).unwrap();
      alert("✅ Blood request created successfully!");
      navigate("/patient/dashboard");
    } catch (err) {
      alert(err?.data?.message || "Failed to create request");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4"
          >
            <FaTint className="text-3xl text-blue-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Blood Request
          </h1>
          <p className="text-gray-600">
            Fill in the details below to request blood from donors
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full">
                <FaTint className="text-xl text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Request Details</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Blood Group */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <FaTint className="text-blue-500" />
                Blood Group *
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                required
              >
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Units Required */}
            <div className="space-y-2">
              <label className="text-gray-700 font-medium">
                Units Required *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="units"
                  min="1"
                  max="10"
                  value={formData.units}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  placeholder="Number of units"
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  units
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">1 unit = 450ml of blood</p>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <FaMapMarkerAlt className="text-blue-500" />
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                placeholder="Enter city name"
                required
              />
            </div>

            {/* Hospital Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <FaHospital className="text-blue-500" />
                Hospital Name *
              </label>
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                placeholder="Enter hospital name"
                required
              />
            </div>

            {/* Emergency Checkbox */}
            <div className={`p-4 border rounded-lg transition-all ${formData.emergency ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="emergency"
                  checked={formData.emergency}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FaExclamationTriangle className={formData.emergency ? "text-red-600" : "text-gray-600"} />
                    <span className={`font-medium ${formData.emergency ? 'text-red-700' : 'text-gray-700'}`}>
                      Emergency Request
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Check this if you need blood urgently. Emergency requests get priority.
                  </p>
                </div>
                {formData.emergency && (
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                    URGENT
                  </span>
                )}
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3 ${isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
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

            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate("/patient/dashboard")}
              className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
            >
              <FaArrowLeft />
              Back to Dashboard
            </button>
          </form>
        </motion.div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">How it works</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Your request will be sent to matching donors in your city</li>
            <li>• Emergency requests are prioritized</li>
            <li>• You'll be notified when donors respond</li>
            <li>• Update your profile if details are incorrect</li>
          </ul>
        </div>
      </div>
    </div>
  );
}