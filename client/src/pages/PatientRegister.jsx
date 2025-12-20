/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterPatientMutation } from "../features/api/bloodApi";
import { motion } from "framer-motion";

// ⭐ FlashMessage import
import FlashMessage, { getMessage } from "../component/FlashMessage";

export default function PatientRegister() {
  const navigate = useNavigate();
  const [registerPatient, { isLoading, isError, error }] =
    useRegisterPatientMutation();

  const [flash, setFlash] = useState({
    type: "",
    msg: "",
  });

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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerPatient(formData).unwrap();

      // ⭐ Success Message
      setFlash({
        type: "success",
        msg: getMessage("auth", "registerSuccess"),
      });

      setTimeout(() => navigate("/login/patient"), 1200);
    } catch (err) {
      // ⭐ Error Message
      setFlash({
        type: "error",
        msg: err?.data?.message || getMessage("auth", "registerFailed"),
      });
    }
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition";

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative">

      {/* ⭐ Flash Message */}
      <FlashMessage
        type={flash.type}
        message={flash.msg}
        onClose={() => setFlash({ type: "", msg: "" })}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 
        border border-gray-200"
      >
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-gray-800 mb-8"
        >
          Patient Registration
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-5"
        >
          <input
            name="name"
            placeholder="Full Name"
            className={inputClass}
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className={inputClass}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className={inputClass}
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            className={inputClass}
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {/* Blood Group Dropdown */}
          <select
            name="bloodGroup"
            className={`${inputClass} bg-white`}
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>

          <input
            name="city"
            placeholder="City"
            className={inputClass}
            value={formData.city}
            onChange={handleChange}
            required
          />

          <input
            name="age"
            type="number"
            placeholder="Age"
            className={inputClass}
            value={formData.age}
            onChange={handleChange}
            required
          />

          {/* Gender */}
          <select
            name="gender"
            className={`${inputClass} bg-white`}
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input
            name="hospitalName"
            placeholder="Hospital Name || Optional"
            className={inputClass}
            value={formData.hospitalName}
            onChange={handleChange}
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium
                     hover:bg-red-700 transition shadow-md hover:shadow-lg
                     disabled:bg-red-300"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </motion.button>

          {isError && (
            <p className="text-red-600 text-sm text-center">
              {error?.data?.message}
            </p>
          )}
        </motion.form>
      </motion.div>
    </div>
  );
}
