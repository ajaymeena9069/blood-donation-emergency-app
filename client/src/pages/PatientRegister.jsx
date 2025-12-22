/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterPatientMutation } from "../features/api/bloodApi";
import { motion } from "framer-motion";
import { 
  FaUser, FaEnvelope, FaLock, FaPhone, FaTint, 
  FaMapMarkerAlt, FaBirthdayCake, FaVenusMars, FaHospital,
  FaArrowLeft
} from "react-icons/fa";
import FlashMessage, { getMessage } from "../component/FlashMessage";

export default function PatientRegister() {
  const navigate = useNavigate();
  const [registerPatient, { isLoading, isError, error }] = useRegisterPatientMutation();

  const [flash, setFlash] = useState({ type: "", msg: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bloodGroup: "",
    city: "",
    age: "",
    gender: "",
    hospitalName: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerPatient(formData).unwrap();
      setFlash({ type: "success", msg: getMessage("auth", "registerSuccess") });
      setTimeout(() => navigate("/login/patient"), 1200);
    } catch (err) {
      setFlash({ type: "error", msg: err?.data?.message || getMessage("auth", "registerFailed") });
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition bg-white";

  return (
    <div className="py-8 px-4">
      <FlashMessage
        type={flash.type}
        message={flash.msg}
        onClose={() => setFlash({ type: "", msg: "" })}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <FaArrowLeft />
          <span>Back to selection</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full">
                <FaUser className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Patient Registration</h2>
                <p className="text-blue-100 text-sm">Fill in your details to request blood</p>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="name"
                  placeholder="Full Name"
                  className={inputClass}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className={inputClass}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={inputClass}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  className={inputClass}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Two Columns for Blood Group and Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Blood Group */}
                <div className="relative">
                  <FaTint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="bloodGroup"
                    className={inputClass}
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                {/* Age */}
                <div className="relative">
                  <FaBirthdayCake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    name="age"
                    type="number"
                    placeholder="Age"
                    className={inputClass}
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Two Columns for City and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* City */}
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    name="city"
                    placeholder="City"
                    className={inputClass}
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Gender */}
                <div className="relative">
                  <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="gender"
                    className={inputClass}
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* Hospital Name */}
              <div className="relative">
                <FaHospital className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="hospitalName"
                  placeholder="Hospital Name (Optional)"
                  className={inputClass}
                  value={formData.hospitalName}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </span>
                ) : (
                  "Create Patient Account"
                )}
              </motion.button>

              {isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm text-center">{error?.data?.message}</p>
                </div>
              )}
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                By registering, you agree to our{" "}
                <button className="text-blue-600 hover:text-blue-700">Terms</button> and{" "}
                <button className="text-blue-600 hover:text-blue-700">Privacy Policy</button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}