/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterDonorMutation } from "../features/api/bloodApi";
import { motion } from "framer-motion";
import { 
  FaUser, FaEnvelope, FaLock, FaPhone, FaTint, 
  FaMapMarkerAlt, FaBirthdayCake, FaVenusMars, FaHandHoldingHeart,
  FaArrowLeft, FaEye, FaEyeSlash
} from "react-icons/fa";

export default function DonorRegister() {
  const navigate = useNavigate();
  const [registerDonor, { isLoading, isError, error }] = useRegisterDonorMutation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bloodGroup: "",
    city: "",
    age: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerDonor(formData).unwrap();
      alert("🎉 Registration successful! You can now login and start saving lives.");
      navigate("/login/donor");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition bg-white";

  return (
    <div className="py-8 px-4">
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
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full">
                <FaHandHoldingHeart className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Donor Registration</h2>
                <p className="text-red-100 text-sm">Join our community of life-savers</p>
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

              {/* Password with visibility toggle */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
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
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                {/* Age */}
                <div className="relative">
                  <FaBirthdayCake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    name="age"
                    type="number"
                    min="18"
                    max="65"
                    placeholder="Age (18-65)"
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

              {/* Donor Benefits Info */}
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <FaHandHoldingHeart className="text-red-600" />
                  Why Register as a Donor?
                </h4>
                <ul className="text-sm text-red-600 space-y-1">
                  <li>• Save up to 3 lives with each donation</li>
                  <li>• Get matched with patients in need</li>
                  <li>• Track your donation history</li>
                  <li>• Receive health checkups</li>
                </ul>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </span>
                ) : (
                  "Become a Life-Saver"
                )}
              </motion.button>

              {/* Error Message */}
              {isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm text-center">
                    {error?.data?.message || "Registration failed. Please try again."}
                  </p>
                </div>
              )}
            </form>

            {/* Terms & Login */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <p className="text-sm text-gray-600 text-center">
                By registering, you agree to our{" "}
                <button className="text-red-600 hover:text-red-700">Terms</button> and{" "}
                <button className="text-red-600 hover:text-red-700">Privacy Policy</button>
              </p>
              <p className="text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login/donor")}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Eligibility Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-700 mb-2">⚠️ Donor Eligibility</h4>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• Must be between 18-65 years old</li>
            <li>• Minimum weight: 50kg</li>
            <li>• No illnesses at the time of donation</li>
            <li>• At least 90 days since last donation</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}