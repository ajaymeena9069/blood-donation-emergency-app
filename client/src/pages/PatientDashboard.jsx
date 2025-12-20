/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  FaBell,
  FaPlusCircle,
  FaHeartbeat,
  FaHistory,
  FaUserCircle,
  FaTrash,
  FaCheck,
  FaExclamationCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useGetPatientRequestsQuery,
} from "../features/api/bloodApi";

export default function PatientDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");

  const { data, isLoading: requestsLoading } = useGetPatientRequestsQuery(user?.id);
  const { data: notificationsData, isLoading: notifLoading } = useGetNotificationsQuery(user?.id);

  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const requests = data?.data || [];
  const recentRequests = requests?.slice(0, 3);
  const completedRequests = requests.filter((r) => r.status === "completed")?.length;
  const pendingRequests = requests.filter((r) => r.status === "pending")?.length;
  const urgentRequests = requests.filter((r) => r.priority === "urgent")?.length;

  const notifications = notificationsData?.notifications || [];
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Status with better colors and icons
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-green-100 text-green-800 border-green-300', icon: '✓', label: 'Completed' };
      case 'approved':
        return { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: '✓', label: 'Approved' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '⏳', label: 'Pending' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800 border-red-300', icon: '✗', label: 'Rejected' };
      case 'cancel':
        return { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: '🗑️', label: 'Cancelled' };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: '?', label: status };
    }
  };

  const handleRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Mark as read failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await deleteNotification(id).unwrap();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* HEADER WITH WELCOME */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800">
            Patient Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, <span className="font-semibold text-red-600">{user?.name || "Patient"}</span>!
          </p>
        </div>
        <div className="flex items-center gap-4">
          {unreadNotifications > 0 && (
            <div className="relative">
              <FaBell className="text-2xl text-red-500" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {unreadNotifications}
              </span>
            </div>
          )}
          <FaUserCircle className="text-4xl md:text-5xl text-red-600" />
        </div>
      </motion.div>

      {/* QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-4">
        <NavLink to="/patient/create/request" className="flex-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 text-lg rounded-xl shadow-lg transition-all duration-300"
          >
            <FaPlusCircle className="text-xl" />
            <span className="font-semibold">Create Blood Request</span>
          </motion.button>
        </NavLink>

        <NavLink to="/patient/requests" className="flex-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 px-6 py-4 text-lg rounded-xl shadow-lg transition-all duration-300"
          >
            <FaHeartbeat className="text-xl" />
            <span className="font-semibold">View All Requests</span>
          </motion.button>
        </NavLink>
      </div>

      {/* STATS CARDS */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <NavLink to="/patient/requests">
          <div className="rounded-xl bg-white shadow-md hover:shadow-xl transition-all hover:-translate-y-1 p-5 cursor-pointer border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Requests</p>
                <p className="text-2xl font-bold mt-1">
                  {requestsLoading ? (
                    <span className="text-gray-400">...</span>
                  ) : (
                    requests.length
                  )}
                </p>
              </div>
              <FaHeartbeat className="text-3xl text-red-500 opacity-80" />
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Click to view all requests
            </div>
          </div>
        </NavLink>

        <NavLink to="/patient/completed/requests">
          <div className="rounded-xl bg-white shadow-md hover:shadow-xl transition-all hover:-translate-y-1 p-5 cursor-pointer border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {requestsLoading ? (
                    <span className="text-gray-400">...</span>
                  ) : (
                    completedRequests
                  )}
                </p>
              </div>
              <FaHistory className="text-3xl text-green-500 opacity-80" />
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Successfully fulfilled requests
            </div>
          </div>
        </NavLink>

        <div className="rounded-xl bg-white shadow-md hover:shadow-xl transition-all hover:-translate-y-1 p-5 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">
                {requestsLoading ? (
                  <span className="text-gray-400">...</span>
                ) : (
                  pendingRequests
                )}
              </p>
            </div>
            <FaExclamationCircle className="text-3xl text-yellow-500 opacity-80" />
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Awaiting donor response
          </div>
        </div>

        <NavLink to="/patient/notifications">
          <div className="rounded-xl bg-white shadow-md hover:shadow-xl transition-all hover:-translate-y-1 p-5 cursor-pointer border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Unread Notifications</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">
                  {notifLoading ? (
                    <span className="text-gray-400">...</span>
                  ) : (
                    unreadNotifications
                  )}
                </p>
              </div>
              <FaBell className="text-3xl text-blue-500 opacity-80" />
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Click to view notifications
            </div>
          </div>
        </NavLink>
      </motion.div>

      {/* MAIN CONTENT - TWO COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT REQUESTS */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Blood Requests</h2>
            <NavLink to="/patient/requests">
              <p className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1">
                View All →
              </p>
            </NavLink>
          </div>

          {requestsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
              <p className="text-gray-500 mt-3">Loading requests...</p>
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-3">
                <FaHeartbeat className="text-4xl mx-auto" />
              </div>
              <p className="text-gray-500">No recent requests found.</p>
              <p className="text-sm text-gray-400 mt-1">Create your first blood request!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((req) => {
                const statusConfig = getStatusConfig(req.status);
                return (
                  <motion.div
                    key={req._id}
                    className="border border-gray-200 hover:border-red-200 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800">Blood Group:</span>
                          <span className="font-bold text-red-600">{req.bloodGroup}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaCalendarAlt className="text-xs" />
                          <span>Created: {formatDate(req.createdAt)}</span>
                        </div>
                        {req.hospital && (
                          <p className="text-sm text-gray-600 mt-1">Hospital: {req.hospital}</p>
                        )}
                      </div>

                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                          <span>{statusConfig.icon}</span>
                          {statusConfig.label}
                        </span>
                        {req.priority === "urgent" && (
                          <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-bold">
                            URGENT
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* NOTIFICATIONS */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-800">Recent Notifications</h2>
              {unreadNotifications > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                  {unreadNotifications} new
                </span>
              )}
            </div>
            <NavLink to="/patient/notifications">
              <p className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1">
                View All →
              </p>
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
              <p className="text-sm text-gray-400 mt-1">You'll see updates here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <motion.div
                  key={n._id}
                  className={`p-4 rounded-xl border-l-4 transition-all hover:shadow-md ${n.read
                    ? "bg-gray-50 border-gray-300 border-l-gray-400"
                    : "bg-red-50 border-red-200 border-l-red-500"
                    }`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: -5 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        {!n.read && (
                          <span className="inline-block h-2 w-2 mt-2 rounded-full bg-red-500"></span>
                        )}
                        <div>
                          <p className={`font-semibold ${n.read ? "text-gray-700" : "text-gray-900"}`}>
                            {n.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-2">
                      {!n.read && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRead(n._id)}
                          className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <FaCheck size={14} />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(n._id)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        title="Delete notification"
                      >
                        <FaTrash size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}