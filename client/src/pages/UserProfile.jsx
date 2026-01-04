/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
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
  FaHistory,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaCalendarAlt,
  FaHeart,
  FaFileMedical
} from "react-icons/fa";
import { useSelector } from "react-redux";

export default function UserProfile() {
  const { user } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
    age: user?.age || "",
    gender: user?.gender || "",
    bloodGroup: user?.bloodGroup || "",
    medicalHistory: user?.medicalHistory || "",
  });

  // Mock data for donations/requests history
  const userHistory = user?.role?.includes("donor") ? [
    { id: 1, date: "2024-12-15", type: "Donation", status: "Completed", units: 1 },
    { id: 2, date: "2024-11-20", type: "Donation", status: "Completed", units: 1 },
    { id: 3, date: "2024-10-10", type: "Donation", status: "Completed", units: 1 },
  ] : [
    { id: 1, date: "2024-12-10", type: "Request", status: "Fulfilled", units: 2 },
    { id: 2, date: "2024-11-25", type: "Request", status: "Pending", units: 1 },
  ];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Save logic here (API call)
    console.log("Saving profile:", editForm);
    setIsEditing(false);
    // Update user in Redux/context
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || "",
      phone: user?.phone || "",
      city: user?.city || "",
      age: user?.age || "",
      gender: user?.gender || "",
      bloodGroup: user?.bloodGroup || "",
      medicalHistory: user?.medicalHistory || "",
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getRoleColor = () => {
    const primaryRole = user?.role?.[0];
    switch(primaryRole) {
      case "donor": return "bg-red-100 text-red-800";
      case "patient": return "bg-blue-100 text-blue-800";
      case "admin": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = () => {
    const primaryRole = user?.role?.[0];
    switch(primaryRole) {
      case "donor": return <FaHeart className="text-red-600" />;
      case "patient": return <FaUser className="text-blue-600" />;
      case "admin": return <FaShieldAlt className="text-gray-600" />;
      default: return <FaUser />;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and settings</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-5xl text-red-600" />
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className={`px-3 py-1 rounded-full ${getRoleColor()} flex items-center gap-2 text-sm font-medium`}>
                    {getRoleIcon()}
                    <span className="capitalize">{user.role?.[0]}</span>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
              <div className="flex items-center justify-center gap-3 text-gray-600">
                <FaEnvelope className="text-sm" />
                <span>{user.email}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {user.role?.includes("donor") ? userHistory.length : userHistory.length}
                </div>
                <div className="text-sm text-gray-600">
                  {user.role?.includes("donor") ? "Donations" : "Requests"}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">{user.bloodGroup}</div>
                <div className="text-sm text-gray-600">Blood Group</div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={isEditing ? handleSave : handleEdit}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {isEditing ? (
                <>
                  <FaSave />
                  Save Changes
                </>
              ) : (
                <>
                  <FaEdit />
                  Edit Profile
                </>
              )}
            </button>

            {isEditing && (
              <button
                onClick={handleCancel}
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </motion.div>

          {/* Availability Status (For Donors) */}
          {user.role?.includes("donor") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Donation Status</h3>
                <div className={`px-3 py-1 rounded-full ${user.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.available ? "Available" : "Not Available"}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Donation:</span>
                  <span className="font-medium">
                    {user.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString() : "Never"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Next Eligible:</span>
                  <span className="font-medium text-green-600">
                    {user.lastDonationDate ? "Available Now" : "Ready to Donate"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column - Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
              <div className="text-sm text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <FaUser className="text-gray-400" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                ) : (
                  <div className="text-gray-800 font-medium">{user.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  Email Address
                </label>
                <div className="text-gray-800 font-medium">{user.email}</div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                ) : (
                  <div className="text-gray-800 font-medium">{user.phone}</div>
                )}
              </div>

              {/* Blood Group */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <FaTint className="text-gray-400" />
                  Blood Group
                </label>
                {isEditing ? (
                  <select
                    name="bloodGroup"
                    value={editForm.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Blood Group</option>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                ) : (
                  <div className="text-gray-800 font-medium">{user.bloodGroup}</div>
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={editForm.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                ) : (
                  <div className="text-gray-800 font-medium">{user.city}</div>
                )}
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <FaBirthdayCake className="text-gray-400" />
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={editForm.age}
                    onChange={handleChange}
                    min="18"
                    max="65"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                ) : (
                  <div className="text-gray-800 font-medium">{user.age} years</div>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <FaVenusMars className="text-gray-400" />
                  Gender
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={editForm.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div className="text-gray-800 font-medium capitalize">{user.gender}</div>
                )}
              </div>

              {/* Roles */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <FaShieldAlt className="text-gray-400" />
                  Roles
                </label>
                <div className="flex flex-wrap gap-2">
                  {user.role?.map((role, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${role === 'donor' ? 'bg-red-100 text-red-800' : role === 'patient' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Medical History (For Patients) */}
          {user.role?.includes("patient") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaFileMedical className="text-red-600" />
                <h3 className="text-xl font-bold text-gray-800">Medical History</h3>
              </div>
              
              {isEditing ? (
                <textarea
                  name="medicalHistory"
                  value={editForm.medicalHistory}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter any relevant medical history..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ) : (
                <div className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {user.medicalHistory || "No medical history recorded"}
                </div>
              )}
            </motion.div>
          )}

          {/* History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaHistory className="text-red-600" />
              <h3 className="text-xl font-bold text-gray-800">
                {user.role?.includes("donor") ? "Donation History" : "Blood Request History"}
              </h3>
            </div>
            
            {userHistory.length > 0 ? (
              <div className="space-y-4">
                {userHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg">
                        <FaCalendarAlt className="text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{item.type}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(item.date).toLocaleDateString()} • {item.units} unit{item.units > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'Completed' || item.status === 'Fulfilled' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaHistory className="text-4xl mx-auto mb-4 text-gray-300" />
                <p>No {user.role?.includes("donor") ? "donations" : "requests"} yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}