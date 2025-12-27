/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation, useLoginUserMutation } from "../features/api/bloodApi";
import { motion } from "framer-motion";
import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaTint,
  FaMapMarkerAlt, FaBirthdayCake, FaVenusMars,
  FaUserMd, FaHandHoldingHeart
} from "react-icons/fa";
import FlashMessage from "../component/FlashMessage";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";

export default function UserRegistration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();

  const [flash, setFlash] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bloodGroup: "",
    city: "",
    age: "",
    gender: "",
    roleType: "", 
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const roles = [
    { value: "donor", label: "Blood Donor", icon: <FaHandHoldingHeart />, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
    { value: "patient", label: "Patient", icon: <FaUserMd />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      roleType: role
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if role is selected
    if (!formData.roleType) {
      setFlash({ type: "error", message: "Please select your role (Donor or Patient)" });
      return;
    }

    const submitData = {
      ...formData,
      role: [formData.roleType] // Convert to array for backend
    };

    try {
      // 1. Register the user
      await registerUser(submitData).unwrap();

      setFlash({
        type: "success",
        message: `Registration successful! Logging you in...`
      });

      // 2. Auto-login after successful registration
      try {
        const loginData = {
          email: formData.email,
          password: formData.password
        };

        const res = await loginUser(loginData).unwrap();

        // Extract role from user object in the response
        let userRole = null;
        if (res.user && res.user.role) {
          userRole = Array.isArray(res.user.role) ? res.user.role[0] : res.user.role;
        } else if (res.role) {
          userRole = Array.isArray(res.role) ? res.role[0] : res.role;
        }

        // Store credentials in Redux
        dispatch(setCredentials({
          token: res.token,
          role: userRole,
          user: res.user
        }));

        setFlash({
          type: "success",
          message: `Welcome ${formData.name}! You're now logged in as a ${formData.roleType === 'donor' ? 'Donor' : 'Patient'}.`
        });

        // 3. Navigate to dashboard
        setTimeout(() => {
          navigate(`/${userRole || formData.roleType}/dashboard`);
        }, 1500);

      } catch (loginError) {
        // If auto-login fails, navigate to login page
        console.error("Auto-login failed:", loginError);
        setFlash({
          type: "warning",
          message: "Account created! Please login with your credentials."
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }

    } catch (error) {
      setFlash({
        type: "error",
        message: error?.data?.message || "Registration failed. Please try again."
      });
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition bg-white";
  const isLoading = isRegistering || isLoggingIn;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 text-sm mt-1">Join our blood donation community</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role Selection Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I want to join as *</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => handleRoleSelect(role.value)}
                    className={`p-3 border rounded-lg text-left transition-all ${formData.roleType === role.value ? `${role.bg} ${role.border} ring-2 ring-offset-1 ring-opacity-50 ${role.value === 'donor' ? 'ring-red-200' : 'ring-blue-200'}` : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={role.color}>{role.icon}</span>
                      <span className={`font-medium ${formData.roleType === role.value ? role.color : 'text-gray-700'}`}>
                        {role.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  className={inputClass}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                  type="password"
                  placeholder="Create a password"
                  className={inputClass}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Phone Number *</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="10-digit number"
                  className={inputClass}
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Blood Group *</label>
              <div className="relative">
                <FaTint className="absolute left-3 top-3 text-gray-400 text-sm" />
                <select
                  name="bloodGroup"
                  className={inputClass}
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your blood group</option>
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* City and Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">City *</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 text-sm" />
                  <input
                    name="city"
                    type="text"
                    placeholder="Your city"
                    className={inputClass}
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Age *</label>
                <div className="relative">
                  <FaBirthdayCake className="absolute left-3 top-3 text-gray-400 text-sm" />
                  <input
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Age"
                    className={inputClass}
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Gender *</label>
              <div className="relative">
                <FaVenusMars className="absolute left-3 top-3 text-gray-400 text-sm" />
                <select
                  name="gender"
                  className={inputClass}
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-medium text-white mt-2 ${formData.roleType === 'donor' ? 'bg-red-600 hover:bg-red-700' : formData.roleType === 'patient' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} transition disabled:opacity-50`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isRegistering ? "Creating Account..." : "Logging you in..."}
                </span>
              ) : (
                `Register as ${formData.roleType === 'donor' ? 'Donor' : formData.roleType === 'patient' ? 'Patient' : 'Member'}`
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By registering, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}