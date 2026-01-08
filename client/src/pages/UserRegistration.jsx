/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation, useLoginUserMutation } from "../features/api/bloodApi";
import { motion } from "framer-motion";
import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaTint,
  FaMapMarkerAlt, FaBirthdayCake, FaVenusMars,
  FaUserMd, FaHandHoldingHeart, FaExclamationCircle
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
  const [fieldErrors, setFieldErrors] = useState({}); // Track field-specific errors
  const [touched, setTouched] = useState({}); // Track touched fields

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

  // Validation rules
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.length < 2) error = "Name must be at least 2 characters";
        break;
      
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email address";
        break;
      
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 6) error = "Password must be at least 6 characters";
        break;
      
      case "phone":
        if (!value) error = "Phone is required";
        else if (!/^[0-9]{10}$/.test(value)) error = "Phone must be 10 digits";
        break;
      
      case "bloodGroup":
        if (!value) error = "Blood group is required";
        break;
      
      case "city":
        if (!value.trim()) error = "City is required";
        break;
      
      case "age":
        if (!value) error = "Age is required";
        else if (value < 18) error = "Must be at least 18 years old";
        else if (value > 65) error = "Must be 65 or younger";
        break;
      
      case "gender":
        if (!value) error = "Gender is required";
        break;
      
      case "roleType":
        if (!value) error = "Please select a role";
        break;
    }
    
    return error;
  };

  // Handle input change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Mark field as touched
  const handleBlur = (e) => {
    const { name } = e.target;
    
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
      
      // Validate on blur
      const error = validateField(name, formData[name]);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      roleType: role
    }));
    
    // Validate role selection
    if (touched.roleType) {
      setFieldErrors(prev => ({
        ...prev,
        roleType: role ? "" : "Please select a role"
      }));
    }
  };

  // Validate entire form
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });
    
    setFieldErrors(errors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      setFlash({
        type: "error",
        message: "Please fix the errors in the form"
      });
      return;
    }

    try {
      // 1. Register the user
      const registerResponse = await registerUser(formData).unwrap();
      
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

        const loginResponse = await loginUser(loginData).unwrap();
        
        // Extract user data
        const userData = loginResponse.user || loginResponse;
        const userRole = Array.isArray(userData.role) ? userData.role[0] : userData.role;

        // Store credentials in Redux
        dispatch(setCredentials({
          token: loginResponse.token,
          role: userRole,
          user: userData
        }));

        setFlash({
          type: "success",
          message: `Welcome ${formData.name}! Redirecting to your dashboard...`
        });

        // 3. Navigate to dashboard
        setTimeout(() => {
          navigate(`/${userRole || formData.roleType}/dashboard`);
        }, 1500);

      } catch (loginError) {
        // Auto-login failed
        console.error("Auto-login failed:", loginError);
        
        let loginErrorMessage = "Account created! Please login manually.";
        
        // Provide specific error messages
        if (loginError?.data?.message?.includes("Invalid credentials")) {
          loginErrorMessage = "Account created, but auto-login failed. Please login with your credentials.";
        } else if (loginError?.status === 404) {
          loginErrorMessage = "Account created, but user not found. Please try logging in.";
        }
        
        setFlash({
          type: "warning",
          message: loginErrorMessage
        });

        setTimeout(() => {
          navigate("/login", { 
            state: { 
              email: formData.email,
              message: "Account created successfully! Please login." 
            } 
          });
        }, 2000);
      }

    } catch (error) {
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      
      // Handle specific backend errors
      if (error?.data?.message) {
        errorMessage = error.data.message;
        
        // If it's a field-specific error from backend (like email exists)
        if (errorMessage.toLowerCase().includes("email")) {
          setFieldErrors(prev => ({
            ...prev,
            email: "Email already exists"
          }));
          setTouched(prev => ({ ...prev, email: true }));
        } else if (errorMessage.toLowerCase().includes("phone")) {
          setFieldErrors(prev => ({
            ...prev,
            phone: "Phone number already exists"
          }));
          setTouched(prev => ({ ...prev, phone: true }));
        }
      } else if (error?.status === 400) {
        errorMessage = "Invalid data submitted. Please check your information.";
      } else if (error?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.originalStatus === "FETCH_ERROR") {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setFlash({
        type: "error",
        message: errorMessage
      });
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const inputClass = (fieldName) => {
    const baseClass = "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition bg-white";
    
    if (fieldErrors[fieldName] && touched[fieldName]) {
      return `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-200`;
    } else if (touched[fieldName] && !fieldErrors[fieldName]) {
      return `${baseClass} border-green-500 focus:border-green-500 focus:ring-green-200`;
    }
    
    return `${baseClass} border-gray-300 focus:border-red-500 focus:ring-red-200`;
  };

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
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to join as *
                {fieldErrors.roleType && touched.roleType && (
                  <span className="text-red-600 text-xs ml-2">
                    <FaExclamationCircle className="inline mr-1" />
                    {fieldErrors.roleType}
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => handleRoleSelect(role.value)}
                    className={`p-3 border rounded-lg text-left transition-all ${formData.roleType === role.value ? `${role.bg} ${role.border} ring-2 ring-offset-1 ring-opacity-50 ${role.value === 'donor' ? 'ring-red-200' : 'ring-blue-200'}` : 'border-gray-200 hover:border-gray-300'} ${fieldErrors.roleType && touched.roleType ? 'border-red-300' : ''}`}
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
                  className={inputClass("name")}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              {fieldErrors.name && touched.name && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle />
                  {fieldErrors.name}
                </p>
              )}
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
                  className={inputClass("email")}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              {fieldErrors.email && touched.email && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                  name="password"
                  type="password"
                  placeholder="Create a password (min. 6 characters)"
                  className={inputClass("password")}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              {fieldErrors.password && touched.password && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle />
                  {fieldErrors.password}
                </p>
              )}
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
                  className={inputClass("phone")}
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              {fieldErrors.phone && touched.phone && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle />
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Blood Group *</label>
              <div className="relative">
                <FaTint className="absolute left-3 top-3 text-gray-400 text-sm" />
                <select
                  name="bloodGroup"
                  className={inputClass("bloodGroup")}
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                >
                  <option value="">Select your blood group</option>
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              {fieldErrors.bloodGroup && touched.bloodGroup && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle />
                  {fieldErrors.bloodGroup}
                </p>
              )}
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
                    className={inputClass("city")}
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                {fieldErrors.city && touched.city && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationCircle />
                    {fieldErrors.city}
                  </p>
                )}
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
                    className={inputClass("age")}
                    value={formData.age}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                {fieldErrors.age && touched.age && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationCircle />
                    {fieldErrors.age}
                  </p>
                )}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Gender *</label>
              <div className="relative">
                <FaVenusMars className="absolute left-3 top-3 text-gray-400 text-sm" />
                <select
                  name="gender"
                  className={inputClass("gender")}
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {fieldErrors.gender && touched.gender && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle />
                  {fieldErrors.gender}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-medium text-white mt-2 ${formData.roleType === 'donor' ? 'bg-red-600 hover:bg-red-700' : formData.roleType === 'patient' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} transition disabled:opacity-50 disabled:cursor-not-allowed`}
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