import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../features/auth/authSlice';
import { useLoginAdminMutation } from '../features/api/bloodApi';
import { FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';
import FlashMessage, { getMessage } from '../component/FlashMessage';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();
  const [flash, setFlash] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAdmin(formData).unwrap();
      dispatch(setCredentials({ 
        token: res.token, 
        role: res.role, 
        user: res.user 
      }));
      
      setFlash({ type: "success", message: "Admin login successful!" });
      setTimeout(() => navigate("/admin/dashboard"), 500);
    } catch (error) {
      console.error("Error:", error);
      setFlash({ 
        type: "error", 
        message: error?.data?.message || "Invalid admin credentials" 
      });
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
            <FaUserShield className="text-4xl text-gray-800 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Admin Login</h2>
          <p className="text-gray-600 text-sm mt-1">Access admin dashboard</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                  type="email"
                  name="email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-gray-800 focus:outline-none"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
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
                  name="password"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-gray-800 focus:outline-none"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login as Admin"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Back to login options
              </button>
            </div>
          </div>
        </div>

        {/* Admin Note */}
        <div className="mt-6 p-3 bg-gray-100 rounded-md">
          <p className="text-xs text-gray-600 text-center">
            ⚠️ Restricted access: Admin credentials required
          </p>
        </div>
      </div>
    </div>
  );
}