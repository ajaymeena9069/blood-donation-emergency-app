import React, { useState } from "react";
import { useLoginPatientMutation } from "../features/api/bloodApi";
import { FaLock, FaEnvelope, FaUserInjured } from "react-icons/fa";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FlashMessage, { getMessage } from "../component/FlashMessage";

export default function PatientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flash, setFlash] = useState({ type: "", message: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginPatient, { isLoading }] = useLoginPatientMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setFlash({ type: "error", message: "Please fill in all fields" });
      return;
    }

    try {
      const res = await loginPatient({ email, password }).unwrap();
      dispatch(setCredentials({ token: res.token, role: res.role, user: res.user }));
      setFlash({ type: "success", message: "Login successful!" });
      setTimeout(() => navigate("/patient/dashboard"), 500);
    } catch (error) {
      setFlash({ type: "error", message: error?.data?.message || "Invalid credentials" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClose={() => setFlash({ type: "", message: "" })}
      />

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <FaUserInjured className="text-4xl text-blue-600 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Patient Login</h2>
          <p className="text-gray-600 text-sm mt-1">Access your patient account</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                  type="email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                  type="password"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <button
                onClick={() => navigate("/register/patient")}
                className="text-blue-600 hover:text-blue-700"
              >
                Create account
              </button>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}