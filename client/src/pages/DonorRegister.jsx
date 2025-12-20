import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterDonorMutation } from "../features/api/bloodApi";
import { motion } from "framer-motion";
export default function DonorRegister() {
  const navigate = useNavigate();
  const [registerDonor, { isLoading, isSuccess, error, isError }] =
    useRegisterDonorMutation();

  const initialData = {
    name: "",
    email: "",
    password: "",
    phone: "",
    bloodGroup: "",
    city: "",
    age: "",
    gender: "",
  };

  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerDonor(formData).unwrap();
      alert("Registration successful!");
      navigate("/donor/login");
    } catch (error) {
      alert(error?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 
                  border border-gray-200"
      >

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Donor Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg shadow-sm 
                       focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Email */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg shadow-sm 
                       focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Password */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg shadow-sm 
                       focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Phone */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            name="phone"
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg shadow-sm 
                       focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Blood Group */}
          <motion.select
            whileFocus={{ scale: 1.02 }}
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg shadow-sm 
                       focus:ring-2 focus:ring-red-500 outline-none bg-white"
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
          </motion.select>

          {/* City */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            name="city"
            placeholder="City name"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg shadow-sm 
                       focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Age */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg shadow-sm 
                       focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Gender */}
          <motion.select
            whileFocus={{ scale: 1.02 }}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg shadow-sm 
                       focus:ring-2 focus:ring-red-500 outline-none bg-white"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </motion.select>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium 
                       hover:bg-red-700 transition shadow-md hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </motion.button>

          {isError && (
            <p className="text-red-600 text-center text-sm">{error?.data?.message}</p>
          )}

          {isSuccess && (
            <p className="text-green-600 text-center text-sm">Registration Successful!</p>
          )}

        </form>
      </motion.div>
    </div>
  );
}
