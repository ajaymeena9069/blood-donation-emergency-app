import React, { useState } from "react";
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
  FaUserCircle
} from "react-icons/fa";
import { useSelector } from "react-redux";

export default function MyProfile() {
  const { user } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
    age: user?.age || "",
    gender: user?.gender || "",
    bloodGroup: user?.bloodGroup || "",
  });

  const handleEdit = () => setIsEditing(true);
  
  const handleSave = () => {
    console.log("Saving:", editForm);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditForm({
      name: user?.name || "",
      phone: user?.phone || "",
      city: user?.city || "",
      age: user?.age || "",
      gender: user?.gender || "",
      bloodGroup: user?.bloodGroup || "",
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  if (!user) {
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <FaEdit />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                <FaSave />
                Save
              </button>
              <button
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
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your name"
              />
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
            <div className="p-3 bg-gray-50 rounded-lg">{user.email}</div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <FaPhone size={14} />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter phone number"
              />
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
              <select
                name="bloodGroup"
                value={editForm.bloodGroup}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
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
              <input
                type="text"
                name="city"
                value={editForm.city}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your city"
              />
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
              <input
                type="number"
                name="age"
                value={editForm.age}
                onChange={handleChange}
                min="18"
                max="65"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your age"
              />
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
              <select
                name="gender"
                value={editForm.gender}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg capitalize">{user.gender}</div>
            )}
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Account Role</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {user.role?.map((role, index) => (
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