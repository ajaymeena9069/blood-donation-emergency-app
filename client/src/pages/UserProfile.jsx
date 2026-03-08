import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTint,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaEdit,
  FaSave,
  FaUserCircle,
  FaArrowLeft
} from "react-icons/fa";
import { useGetProfileQuery, useUpdateUserMutation } from "../features/api/bloodApi";
import { registerSchema } from "../validators/user.validator.js";

const updateProfileSchema = registerSchema.partial().omit({ email: true, password: true });

export default function MyProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { data: userProfile, isLoading: profileLoading } = useGetProfileQuery();
  const user = userProfile?.data;
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updateProfileSchema)
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone,
        city: user.city,
        age: user.age,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
      });
    }
  }, [user, reset]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSave = async (data) => {
    try {
      await updateUser(data).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  if (profileLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-medium"
      >
        <FaArrowLeft />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaUserCircle className="text-5xl text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>
        <div className="mt-2">
          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            Blood Group: {user.bloodGroup}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit(onSave)}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                <FaEdit />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  <FaSave />
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <FaUser size={14} />
                Full Name
              </label>
              {isEditing ? (
                <>
                  <input
                    {...register("name")}
                    type="text"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">{user.name}</div>
              )}
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <FaEnvelope size={14} />
                Email Address
              </label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-500">{user.email}</div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <FaPhone size={14} />
                Phone Number
              </label>
              {isEditing ? (
                <>
                  <input
                    {...register("phone")}
                    type="tel"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                </>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">{user.phone}</div>
              )}
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <FaTint size={14} />
                Blood Group
              </label>
              {isEditing ? (
                <>
                  <select
                    {...register("bloodGroup")}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.bloodGroup ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Blood Group</option>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                  {errors.bloodGroup && <p className="text-red-500 text-xs">{errors.bloodGroup.message}</p>}
                </>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                  <span className="font-bold text-red-600 text-lg">{user.bloodGroup}</span>
                </div>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <FaMapMarkerAlt size={14} />
                City
              </label>
              {isEditing ? (
                <>
                  <input
                    {...register("city")}
                    type="text"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your city"
                  />
                  {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                </>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">{user.city}</div>
              )}
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <FaBirthdayCake size={14} />
                Age
              </label>
              {isEditing ? (
                <>
                  <input
                    {...register("age", { valueAsNumber: true })}
                    type="number"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your age"
                  />
                  {errors.age && <p className="text-red-500 text-xs">{errors.age.message}</p>}
                </>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">{user.age} years</div>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <FaVenusMars size={14} />
                Gender
              </label>
              {isEditing ? (
                <>
                  <select
                    {...register("gender")}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
                </>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg capitalize">{user.gender}</div>
              )}
            </div>

            {/* Role (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Account Role</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {(Array.isArray(user.role) ? user.role : [user.role]).map((role, index) => (
                  <span
                    key={index}
                    className="inline-block mr-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </form>

        {isEditing && (
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-500 mb-4">
              Note: Your email cannot be changed. Contact support for email updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}