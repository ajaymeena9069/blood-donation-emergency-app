import React, { useState } from 'react';
import { setCredentials } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginDonorMutation } from '../features/api/bloodApi';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import FlashMessage, { getMessage } from '../component/FlashMessage';

export default function DonorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flash, setFlash] = useState({
    type: "",
    message: ""
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginDonor, { isLoading }] = useLoginDonorMutation();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setFlash({
        type: "error",
        message: getMessage("auth", "loginFailed") // Predefined message
      });
      return;
    }

    try {
      const res = await loginDonor({ email, password }).unwrap();

      dispatch(setCredentials({
        token: res.token,
        role: res.role,
        user: res.user
      }));

      setFlash({
        type: "success",
        message: getMessage("auth", "loginSuccess") // Predefined message
      });

      setTimeout(() => navigate("/donor/dashboard"), 600);
    } catch (error) {
      console.error("Error:", error);

      setFlash({
        type: "error",
        message:
          error?.data?.message ||
          getMessage("auth", "loginFailed") // Predefined message fallback
      });
    }

  };

  return (
    <>
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClose={() => setFlash({ type: "", message: "" })}
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Login Donor
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
              <FaEnvelope className="text-gray-500 text-lg" />
              <input
                type="email"
                placeholder="Enter Email"
                className="bg-transparent w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
              <FaLock className="text-gray-500 text-lg" />
              <input
                type="password"
                placeholder="Enter Password"
                className="bg-transparent w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/register/donor" className="text-red-600 font-semibold">
              Register
            </a>
          </p>
        </div>
      </div>
    </>

  );
}
