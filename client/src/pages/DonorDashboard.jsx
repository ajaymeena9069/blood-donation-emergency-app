/* eslint-disable no-unused-vars */
import React from "react";
import {
  FaUserCircle,
  FaTint,
  FaBell,
  FaHandHoldingHeart,
  FaCalendarAlt,
  FaHistory,
  FaClock,
  FaHeartbeat
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  useGetDonorMatchesQuery,
  useGetDonorNotificationsQuery,
} from "../features/api/bloodApi";

export default function DonorDashboard() {
  const { user } = useSelector((state) => state.auth);

  const { data: matchesData, isLoading: matchesLoading } = useGetDonorMatchesQuery();
  const { data: notificationsData, isLoading: notifLoading } = useGetDonorNotificationsQuery(user?.id, { skip: !user?.id });

  const matches = matchesData?.data || [];
  const notifications = notificationsData?.data || [];

  const totalMatches = matches.length;
  const completedDonations = matches.filter((req) => req.status === "completed").length;
  const pendingMatches = matches.filter((req) => req.status === "pending").length;
  const acceptedMatches = matches.filter((req) => req.status === "accepted").length;
  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;
  const recentMatches = matches.slice(0, 3);
  
  // Find last donation
  const findLastDonation = () => {
    const completedDonations = matches
      .filter(req => req.status === "completed")
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    if (completedDonations.length > 0) {
      return completedDonations[0];
    }
    return null;
  };

  const lastDonation = findLastDonation();
  
  // ---------------------------
  // STATUS COLORS MAP
  // ---------------------------
  const statusColors = {
    pending: {
      card: "border-yellow-500 bg-yellow-50",
      badge: "bg-yellow-100 text-yellow-700",
      icon: "⏳"
    },
    accepted: {
      card: "border-blue-500 bg-blue-50",
      badge: "bg-blue-100 text-blue-700",
      icon: "✅"
    },
    completed: {
      card: "border-green-500 bg-green-50",
      badge: "bg-green-100 text-green-700",
      icon: "🎉"
    },
    cancel: {
      card: "border-red-500 bg-red-50",
      badge: "bg-red-100 text-red-700",
      icon: "❌"
    },
    rejected: {
      card: "border-red-500 bg-red-50",
      badge: "bg-red-100 text-red-700",
      icon: "🚫"
    },
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Donor Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name || "Donor"}! Ready to save lives.</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadNotificationCount > 0 && (
            <div className="relative">
              <FaBell className="text-2xl text-red-500" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            </div>
          )}
          <FaUserCircle className="text-5xl text-gray-700" />
        </div>
      </motion.div>
      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <NavLink to="/donor/matching-requests">
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-red-200 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Matches</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{matchesLoading ? "..." : totalMatches}</p>
              </div>
              <FaTint className="text-3xl text-red-500 opacity-80" />
            </div>
            <p className="text-xs text-gray-500 mt-3">Click to view all</p>
          </div>
        </NavLink>

        <NavLink to="/donor/history">
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{matchesLoading ? "..." : completedDonations}</p>
              </div>
              <FaHandHoldingHeart className="text-3xl text-green-500 opacity-80" />
            </div>
            <p className="text-xs text-gray-500 mt-3">Successful donations</p>
          </div>
        </NavLink>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{matchesLoading ? "..." : pendingMatches}</p>
            </div>
            <FaClock className="text-3xl text-yellow-500 opacity-80" />
          </div>
          <p className="text-xs text-gray-500 mt-3">Awaiting your response</p>
        </div>

        <NavLink to="/donor/notifications">
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Unread</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{notifLoading ? "..." : unreadNotificationCount}</p>
              </div>
              <FaBell className="text-3xl text-blue-500 opacity-80" />
            </div>
            <p className="text-xs text-gray-500 mt-3">New notifications</p>
          </div>
        </NavLink>
      </motion.div>

      {/* Quick Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Matches */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Matching Requests</h2>
            <NavLink to="/donor/matching-requests">
              <p className="text-red-600 hover:text-red-700 text-sm font-semibold">View All →</p>
            </NavLink>
          </div>

          {matchesLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
              <p className="text-gray-500 mt-3">Loading matches...</p>
            </div>
          ) : recentMatches.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-3">
                <FaHeartbeat className="text-4xl mx-auto" />
              </div>
              <p className="text-gray-500">No matching requests yet.</p>
              <p className="text-sm text-gray-400 mt-1">You'll see requests here when patients need your blood type.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentMatches.map((req) => {
                const color = statusColors[req.status] || statusColors["pending"];
                return (
                  <motion.div
                    key={req._id}
                    className={`border-l-4 p-4 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition-shadow ${color.card}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm ${color.badge} px-2 py-1 rounded font-medium flex items-center gap-1`}>
                          <span>{color.icon}</span>
                          {req.status}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-800">Patient: {req?.patientId?.name || "Anonymous"}</p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <p className="text-sm text-gray-600">Blood Group: <span className="font-bold text-red-600">{req.bloodGroup}</span></p>
                        <p className="text-sm text-gray-600">Units: <span className="font-bold">{req.units}</span></p>
                        <p className="text-sm text-gray-500">{formatDate(req.createdAt)}</p>
                      </div>
                    </div>
                    <NavLink to={`/donor/matching-requests/${req._id}`} className="text-red-600 hover:text-red-700 font-medium text-sm">
                      View →
                    </NavLink>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Quick Stats & Last Donation */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Your Donation Summary</h2>
          
          {/* Last Donation Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FaHistory className="text-red-600" />
              <h3 className="font-semibold text-gray-700">Last Donation</h3>
            </div>
            {lastDonation ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-green-700">✅ Completed</p>
                  <p className="text-sm text-green-600">{formatDate(lastDonation.updatedAt)}</p>
                </div>
                <p className="text-sm text-gray-700">
                  You donated <span className="font-bold">{lastDonation.units} unit(s)</span> of {lastDonation.bloodGroup} blood
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Patient: {lastDonation.patientId?.name || "Anonymous"}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-gray-500">No donation history yet.</p>
                <p className="text-sm text-gray-400 mt-1">Your first donation will appear here.</p>
              </div>
            )}
          </div>

          {/* Blood Group Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FaTint className="text-red-600" />
              <h3 className="font-semibold text-gray-700">Your Blood Group</h3>
            </div>
            <div className="text-center p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-4xl font-bold text-red-600">{user?.bloodGroup || "Not Set"}</p>
              <p className="text-sm text-gray-600 mt-2">
                {user?.bloodGroup 
                  ? "Patients with this blood type can receive your donations"
                  : "Please update your profile with your blood type"
                }
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <NavLink to="/donor/matching-requests">
                <div className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center justify-between">
                  <span className="font-medium">View All Requests</span>
                  <span className="text-red-600">→</span>
                </div>
              </NavLink>
              <NavLink to="/donor/history">
                <div className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center justify-between">
                  <span className="font-medium">Donation History</span>
                  <span className="text-red-600">→</span>
                </div>
              </NavLink>
              <NavLink to="/donor/notifications">
                <div className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center justify-between">
                  <span className="font-medium">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                      {unreadNotificationCount}
                    </span>
                  )}
                </div>
              </NavLink>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Notifications Preview */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">Recent Notifications</h2>
            {unreadNotificationCount > 0 && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                {unreadNotificationCount} new
              </span>
            )}
          </div>
          <NavLink to="/donor/notifications">
            <p className="text-red-600 hover:text-red-700 text-sm font-semibold">View All →</p>
          </NavLink>
        </div>

        {notifLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-3">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-3">
              <FaBell className="text-4xl mx-auto" />
            </div>
            <p className="text-gray-500">No notifications yet.</p>
            <p className="text-sm text-gray-400 mt-1">You'll get updates about matching requests here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 3).map((n) => (
              <div
                key={n._id}
                className={`p-4 rounded-xl border-l-4 ${n.isRead 
                  ? "bg-gray-50 border-gray-300 border-l-gray-400" 
                  : "bg-red-50 border-red-200 border-l-red-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`font-semibold ${n.isRead ? "text-gray-700" : "text-gray-900"}`}>
                      {n.title}
                      {!n.isRead && <span className="ml-2 text-xs text-red-600">● NEW</span>}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}