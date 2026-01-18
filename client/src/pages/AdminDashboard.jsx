import React, { useState } from "react";
import {
  FaUsers,
  FaHeartbeat,
  FaHospital,
  FaChartLine,
  FaBell,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUserShield,
  FaExclamationTriangle,
  FaArrowRight,
  FaTint,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaEye,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const stats = {
    totalUsers: 1542,
    totalDonors: 876,
    totalPatients: 666,
    totalRequests: 342,
    pendingRequests: 45,
    completedRequests: 254,
    activeHospitals: 32,
    todayRequests: 12
  };

  const recentRequests = [
    {
      id: "REQ001",
      patient: "Rahul Sharma",
      bloodGroup: "B+",
      units: 2,
      hospital: "AIIMS Delhi",
      city: "Delhi",
      status: "pending",
      emergency: true,
      date: "2024-01-15",
      time: "10:30 AM"
    },
    {
      id: "REQ002",
      patient: "Priya Patel",
      bloodGroup: "O-",
      units: 1,
      hospital: "Apollo Hospital",
      city: "Mumbai",
      status: "accepted",
      emergency: false,
      date: "2024-01-14",
      time: "2:15 PM"
    },
    {
      id: "REQ003",
      patient: "Amit Kumar",
      bloodGroup: "A+",
      units: 3,
      hospital: "Fortis Hospital",
      city: "Bangalore",
      status: "completed",
      emergency: true,
      date: "2024-01-13",
      time: "9:45 AM"
    },
    {
      id: "REQ004",
      patient: "Sneha Gupta",
      bloodGroup: "AB+",
      units: 1,
      hospital: "Max Hospital",
      city: "Chennai",
      status: "pending",
      emergency: false,
      date: "2024-01-12",
      time: "4:20 PM"
    }
  ];

  const recentUsers = [
    {
      id: "USR001",
      name: "Vikram Singh",
      email: "vikram@example.com",
      role: "donor",
      bloodGroup: "O+",
      status: "active",
      joined: "2024-01-10"
    },
    {
      id: "USR002",
      name: "Neha Verma",
      email: "neha@example.com",
      role: "patient",
      bloodGroup: "B-",
      status: "active",
      joined: "2024-01-09"
    },
    {
      id: "USR003",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      role: "donor",
      bloodGroup: "A+",
      status: "inactive",
      joined: "2024-01-08"
    },
    {
      id: "USR004",
      name: "Pooja Sharma",
      email: "pooja@example.com",
      role: "patient",
      bloodGroup: "AB+",
      status: "active",
      joined: "2024-01-07"
    }
  ];

  const systemStats = {
    successRate: "94%",
    avgResponseTime: "2.3 hours",
    monthlyGrowth: "12.5%",
    activeSessions: 42
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-600" />;
      case 'accepted': return <FaCheckCircle className="text-blue-600" />;
      case 'completed': return <FaCheckCircle className="text-green-600" />;
      case 'rejected': return <FaTimesCircle className="text-red-600" />;
      case 'active': return <FaCheckCircle className="text-green-600" />;
      case 'inactive': return <FaTimesCircle className="text-gray-600" />;
      default: return <FaClock className="text-gray-600" />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'donor': return 'bg-red-100 text-red-800 border-red-300';
      case 'patient': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg">
                <FaUserShield className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm">Welcome back, System Administrator</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <FaBell className="text-xl text-gray-600 hover:text-purple-600 cursor-pointer" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  SA
                </div>
                <div>
                  <p className="font-medium text-gray-900">System Admin</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border p-4 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
              </div>
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-lg">
                <FaUsers className="text-xl" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="text-green-600 font-medium">↑ 12%</span> from last month
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border p-4 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Blood Donors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalDonors}</p>
              </div>
              <div className="p-2.5 bg-red-100 text-red-600 rounded-lg">
                <FaHeartbeat className="text-xl" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="text-green-600 font-medium">↑ 8%</span> from last month
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border p-4 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Blood Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRequests}</p>
              </div>
              <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
                <FaTint className="text-xl" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="text-green-600 font-medium">↑ 15%</span> from last month
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border p-4 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Active Hospitals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeHospitals}</p>
              </div>
              <div className="p-2.5 bg-green-100 text-green-600 rounded-lg">
                <FaHospital className="text-xl" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="text-green-600 font-medium">↑ 5%</span> from last month
              </p>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          {["overview", "requests", "users", "hospitals", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab
                  ? "bg-white border-t border-l border-r border-gray-200 text-purple-600"
                  : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recent Requests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">Recent Blood Requests</h2>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search requests..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <FaFilter className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{req.id}</p>
                            <p className="text-xs text-gray-500">{req.date} • {req.time}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{req.patient}</p>
                            <p className="text-xs text-gray-500">{req.hospital}, {req.city}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-red-50 rounded">
                              <FaTint className="text-red-600 text-sm" />
                            </div>
                            <span className="font-bold text-red-700">{req.bloodGroup}</span>
                            <span className="text-gray-600 text-sm">({req.units} units)</span>
                            {req.emergency && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                                <FaExclamationTriangle className="text-xs" />
                                Emergency
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(req.status)}`}>
                            {getStatusIcon(req.status)}
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <FaEye />
                            </button>
                            <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                              <FaEdit />
                            </button>
                            <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-gray-200">
                <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium">
                  View All Requests <FaArrowRight />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Users & System Stats */}
          <div className="space-y-6">
            {/* Recent Users */}
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Recent Users</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <FaTint className="text-red-500 text-xs" />
                            <span className="text-xs text-gray-700">{user.bloodGroup}</span>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${getStatusBadge(user.status)}`}>
                            {getStatusIcon(user.status)}
                            {user.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Joined</p>
                        <p className="text-sm font-medium">{user.joined}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium">
                  View All Users <FaArrowRight />
                </button>
              </div>
            </div>

            {/* System Stats */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FaChartLine className="text-xl text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">System Statistics</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/90">Success Rate</span>
                    <span className="text-xl font-bold text-white">{systemStats.successRate}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/90">Avg Response Time</span>
                    <span className="text-xl font-bold text-white">{systemStats.avgResponseTime}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/90">Monthly Growth</span>
                    <span className="text-xl font-bold text-white">{systemStats.monthlyGrowth}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/90">Active Sessions</span>
                    <span className="text-xl font-bold text-white">{systemStats.activeSessions}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/20">
                  <p className="text-white/80 text-sm">Last updated: Just now</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
              </div>

              <div className="p-4 space-y-2">
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <p className="font-medium text-blue-700">Add New Hospital</p>
                  <p className="text-sm text-blue-600">Register a new hospital partner</p>
                </button>

                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <p className="font-medium text-green-700">Send Broadcast</p>
                  <p className="text-sm text-green-600">Send notification to all users</p>
                </button>

                <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <p className="font-medium text-purple-700">Generate Report</p>
                  <p className="text-sm text-purple-600">Create monthly analytics report</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}