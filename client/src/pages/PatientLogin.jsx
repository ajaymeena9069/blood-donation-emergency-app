/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLoginPatientMutation } from "../features/api/bloodApi";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

// 🔥 FlashMessage Component
import FlashMessage, { getMessage } from "../component/FlashMessage";

export default function PatientLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flash, setFlash] = useState({ type: "", message: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginPatient, { isLoading }] = useLoginPatientMutation();

  const showFlash = (type, section, key) => {
    setFlash({ type, message: getMessage(section, key) });

    setTimeout(() => {
      setFlash({ type: "", message: "" });
    }, 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showFlash("error", "auth", "loginFailed");
      return;
    }

    try {
      const res = await loginPatient({ email, password }).unwrap();

      dispatch(setCredentials({ token: res.token, role: res.role, user: res.user }));

      showFlash("success", "auth", "loginSuccess");

      setTimeout(() => navigate("/patient/dashboard"), 600);

    } catch (error) {
      showFlash("error", "auth", "loginFailed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">

      {/* Flash Message */}
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClose={() => setFlash({ type: "", message: "" })}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
      >

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center mb-6 text-gray-800"
        >
          Login Patient
        </motion.h1>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg"
          >
            <FaEnvelope className="text-gray-500 text-lg" />
            <input
              type="email"
              placeholder="Enter Email"
              className="bg-transparent w-full outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg"
          >
            <FaLock className="text-gray-500 text-lg" />
            <input
              type="password"
              placeholder="Enter Password"
              className="bg-transparent w-full outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>

          {/* Login Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/donor/register" className="text-red-600 font-semibold">
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
}
