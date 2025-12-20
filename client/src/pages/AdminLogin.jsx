import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCredentials } from '../features/auth/authSlice'
import { useState } from 'react'
import { useLoginAdminMutation } from '../features/api/bloodApi'

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [loginAdmin, { isError, isLoading, error }] = useLoginAdminMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAdmin(formData).wrap();
      dispatch(setCredentials({ token: res.token, role: res.admin }));
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert(error?.data?.message || "Registration failed!");
    }
  }
  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input type="email"
            name='email'
            placeholder='Enter your email'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input type="password"
            name='password'
            placeholder='Enter your password'
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type='submit' disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          {isError && <p className="error">{error?.data?.message}</p>}
        </form>
      </div>
    </>
  )
}
