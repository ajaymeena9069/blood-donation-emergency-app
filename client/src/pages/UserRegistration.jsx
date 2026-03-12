import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterUserMutation, useLoginUserMutation } from "../features/api/bloodApi";
import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaTint,
  FaMapMarkerAlt, FaBirthdayCake, FaVenusMars,
  FaUserMd, FaHandHoldingHeart
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { registerSchema } from "../validators/user.validator.js";
import FlashMessage from "../component/FlashMessage";

export default function UserRegistration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [flash, setFlash] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerUser] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      bloodGroup: "",
      city: "",
      age: "",
      gender: "",
      roleType: "",
      address: ""
    }
  });

  const selectedRole = watch("roleType");

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const roles = [
    { value: "donor", label: "Blood Donor", icon: <FaHandHoldingHeart />, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
    { value: "patient", label: "Patient", icon: <FaUserMd />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" }
  ];

  const onSubmit = async (formData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await registerUser(formData).unwrap();

      const loginResponse = await loginUser({
        email: formData.email,
        password: formData.password
      }).unwrap();

      const user = loginResponse.user || loginResponse;
      const userRole = Array.isArray(user.role) ? user.role[0] : user.role;

      dispatch(setCredentials({
        token: loginResponse.token,
        role: userRole,
        user
      }));

      setFlash({ type: "success", message: `Welcome ${formData.name}! Redirecting...` });

      setTimeout(() => {
        navigate(`/${userRole}/dashboard`);
      }, 1500);

    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
      if (error?.data?.errors) {
        errorMessage = error.data.errors[0].message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === "FETCH_ERROR") {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setFlash({ type: "error", message: errorMessage });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition bg-white";

  return (
    <>
      <FlashMessage flash={flash} setFlash={setFlash} />
      <div className="min-h-screen bg-gray-50 py-8 px-4">

      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 p-3 bg-red-50 rounded-full">
              <FaTint className="text-2xl text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 text-sm mt-1">Join our blood donation community</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to join as *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setValue("roleType", role.value, { shouldValidate: true })}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      selectedRole === role.value 
                        ? `${role.bg} ${role.border} ring-2 ring-offset-1 ring-opacity-50 ${role.value === 'donor' ? 'ring-red-200' : 'ring-blue-200'}` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={role.color}>{role.icon}</span>
                      <span className={`font-medium ${selectedRole === role.value ? role.color : 'text-gray-700'}`}>
                        {role.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.roleType && <p className="text-red-500 text-xs mt-1">{errors.roleType.message}</p>}
            </div>

            {[
              { icon: <FaUser />, name: "name", type: "text", placeholder: "Full name" },
              { icon: <FaEnvelope />, name: "email", type: "email", placeholder: "you@example.com" },
              { icon: <FaLock />, name: "password", type: "password", placeholder: "Create a password" },
              { icon: <FaPhone />, name: "phone", type: "tel", placeholder: "10-digit number" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm text-gray-700 mb-1 capitalize">
                  {field.name === "phone" ? "Phone Number *" : `${field.name} *`}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 text-sm">
                    {field.icon}
                  </span>
                  <input
                    {...register(field.name)}
                    type={field.type}
                    placeholder={field.placeholder}
                    className={`${inputClass} ${errors[field.name] ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>}
              </div>
            ))}

            <div>
              <label className="block text-sm text-gray-700 mb-1">Blood Group *</label>
              <div className="relative">
                <FaTint className="absolute left-3 top-3 text-gray-400 text-sm" />
                <select
                  {...register("bloodGroup")}
                  className={`${inputClass} ${errors.bloodGroup ? 'border-red-500' : ''}`}
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              {errors.bloodGroup && <p className="text-red-500 text-xs mt-1">{errors.bloodGroup.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">City *</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 text-sm" />
                  <input
                    {...register("city")}
                    type="text"
                    placeholder="Your city"
                    className={`${inputClass} ${errors.city ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Age *</label>
                <div className="relative">
                  <FaBirthdayCake className="absolute left-3 top-3 text-gray-400 text-sm" />
                  <input
                    {...register("age")}
                    type="number"
                    placeholder="Age"
                    className={`${inputClass} ${errors.age ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Gender *</label>
              <div className="relative">
                <FaVenusMars className="absolute left-3 top-3 text-gray-400 text-sm" />
                <select
                  {...register("gender")}
                  className={`${inputClass} ${errors.gender ? 'border-red-500' : ''}`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Address (Optional)</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 text-sm" />
                <textarea
                  {...register("address")}
                  rows="3"
                  placeholder="Enter your complete address"
                  className={`${inputClass} ${errors.address ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <button
              type="submit"
              disabled={!selectedRole || isSubmitting}
              className={`w-full py-3 rounded-lg font-medium text-white transition ${
                selectedRole === 'donor' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : selectedRole === 'patient' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              } ${!selectedRole || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Registering...
                </span>
              ) : (
                `Register as ${selectedRole === 'donor' ? 'Donor' : selectedRole === 'patient' ? 'Patient' : 'Member'}`
              )}
            </button>
          </form>

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

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By registering, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
      </div>
    </>
  );
}