import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FaExchangeAlt,
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaHospital,
  FaTint
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useGetPatientRequestsQuery,
  useActivateRoleMutation
} from "../features/api/bloodApi";
import { setCredentials } from "../features/auth/authSlice";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [flash, setFlash] = useState({ type: "", message: "" });
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const { data, isLoading: requestsLoading } = useGetPatientRequestsQuery(user?.id);
  const { data: notificationsData } = useGetNotificationsQuery(user?.id);
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [activateRole] = useActivateRoleMutation();

  const requests = data?.data || [];
  const notifications = notificationsData?.notifications || [];
  const recentRequests = requests.slice(0, 3);

  // Stats
  const stats = {
    totalRequests: requests.length,
    completedRequests: requests.filter(r => r.status === "completed").length,
    pendingRequests: requests.filter(r => r.status === "pending").length,
    unreadNotifications: notifications.filter(n => !n.read).length
  };

  // Role management
  const userRoles = user?.role || [];
  const currentRole = "patient";

  const allRoles = [
    { id: "donor", name: "Blood Donor", icon: "🩸", color: "from-red-500 to-red-600", bg: "bg-red-50", border: "border-red-200" },
    { id: "patient", name: "Blood Recipient", icon: "🏥", color: "from-blue-500 to-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    { id: "admin", name: "System Admin", icon: "👑", color: "from-gray-700 to-gray-800", bg: "bg-gray-50", border: "border-gray-200" }
  ];

  const userCurrentRoles = allRoles.filter(role => userRoles.includes(role.id));
  const availableRoles = allRoles.filter(role => !userRoles.includes(role.id) && role.id !== currentRole);

  // Status colors
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed': return { bg: "bg-green-50", text: "text-green-800", border: "border-green-200", badge: "bg-green-100 text-green-800 border-green-300", icon: "✓", label: 'Completed' };
      case 'approved': return { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200", badge: "bg-blue-100 text-blue-800 border-blue-300", icon: '✓', label: 'Approved' };
      case 'pending': return { bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: '⏳', label: 'Pending' };
      case 'rejected': return { bg: "bg-red-50", text: "text-red-800", border: "border-red-200", badge: "bg-red-100 text-red-800 border-red-300", icon: '✗', label: 'Rejected' };
      default: return { bg: "bg-gray-50", text: "text-gray-800", border: "border-gray-200", badge: "bg-gray-100 text-gray-800 border-gray-300", icon: '?', label: status };
    }
  };

  // Role switch handler
  const handleRoleSwitch = async (roleId) => {
    if (isSwitchingRole) return;

    setIsSwitchingRole(true);
    setShowRoleDropdown(false);
    setFlash({ type: "info", message: `Activating ${roleId} role...` });

    try {
      const response = await activateRole({ roleToActivate: roleId }).unwrap();

      if (response.success) {
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
          dispatch(setCredentials({
            token: response.data.token,
            user: response.data?.user || user
          }));
        }

        setFlash({ type: "success", message: `✅ Role activated! Redirecting...` });
        setTimeout(() => navigate(`/${roleId}/dashboard`), 1000);
      } else {
        throw new Error(response.message || "Activation failed");
      }
    } catch (error) {
      console.error("Role switch error:", error);
      setFlash({
        type: "error",
        message: `❌ ${error?.data?.message || error.message || "Failed to activate role"}`
      });
    } finally {
      setIsSwitchingRole(false);
    }
  };

  // Quick switch to existing role
  const switchToExistingRole = (roleId) => {
    if (roleId === currentRole) return;
    setFlash({ type: "info", message: `Switching to ${roleId} dashboard...` });
    setTimeout(() => navigate(`/${roleId}/dashboard`), 300);
  };

  // Notification handlers
  const handleRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Mark as read failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this notification?")) {
      try {
        await deleteNotification(id).unwrap();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Flash message component
  const FlashMessage = () => {
    if (!flash.message) return null;

    const colors = {
      success: "bg-green-50 border-green-300",
      error: "bg-red-50 border-red-300",
      info: "bg-blue-50 border-blue-300"
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-6 right-6 z-50 rounded-lg border p-4 shadow-lg max-w-md ${colors[flash.type]}`}
      >
        <div className="flex items-start">
          <FaCheckCircle className={`mt-1 ${flash.type === 'success' ? 'text-green-600' : flash.type === 'error' ? 'text-red-600' : 'text-blue-600'}`} />
          <div className="ml-3 flex-1">
            <p className="font-medium capitalize text-gray-900">{flash.type}</p>
            <p className="text-sm text-gray-700 mt-1">{flash.message}</p>
          </div>
          <button onClick={() => setFlash({ type: "", message: "" })} className="ml-4 text-gray-500 hover:text-gray-800">✕</button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <FlashMessage />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaHeartbeat className="text-xl text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name || "Patient"}!</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {availableRoles.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                disabled={isSwitchingRole}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
              >
                {isSwitchingRole ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Activating...</span>
                  </>
                ) : (
                  <>
                    <FaExchangeAlt />
                    <span>Activate Role</span>
                  </>
                )}
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <p className="px-4 py-2 text-sm font-medium text-gray-700">Available Roles</p>
                  {availableRoles.map(role => (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSwitch(role.id)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left text-sm"
                    >
                      <span className="text-lg">{role.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{role.name}</p>
                        <p className="text-xs text-gray-500">Click to activate</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <NavLink to="/notifications" className="relative">
              <FaBell className="text-xl text-gray-600 hover:text-blue-600" />
              {stats.unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                  {stats.unreadNotifications}
                </span>
              )}
            </NavLink>
            <NavLink to="/patient/profile">
              <FaUserCircle className="text-3xl text-gray-700 hover:text-blue-600" />
            </NavLink>
          </div>
        </div>
      </div>

      {/* Role badges */}
      {userCurrentRoles.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 border mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600 mr-2">Your roles:</span>
            {userCurrentRoles.map(role => (
              <button
                key={role.id}
                onClick={() => switchToExistingRole(role.id)}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 ${role.id === currentRole ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'}`}
              >
                <span>{role.icon}</span>
                <span>{role.name}</span>
                {role.id === currentRole && <span className="text-xs bg-white px-2 rounded-full">Active</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <NavLink to="/patient/create/request" className="flex-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl shadow-lg transition-all text-sm"
          >
            <FaPlusCircle />
            <span className="font-semibold">Create Blood Request</span>
          </motion.button>
        </NavLink>

        <NavLink to="/patient/requests/all" className="flex-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl shadow-lg transition-all text-sm"
          >
            <FaHeartbeat />
            <span className="font-semibold">View All Requests</span>
          </motion.button>
        </NavLink>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div 
          onClick={() => navigate("/patient/requests/all")}
          className="bg-white rounded-xl p-4 border hover:shadow-md cursor-pointer"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Total Requests</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {requestsLoading ? "..." : stats.totalRequests}
              </p>
            </div>
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
              <FaHeartbeat className="text-lg" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate("/patient/requests/completed")}
          className="bg-white rounded-xl p-4 border hover:shadow-md cursor-pointer"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {requestsLoading ? "..." : stats.completedRequests}
              </p>
            </div>
            <div className="p-2.5 bg-green-100 text-green-600 rounded-lg">
              <FaHistory className="text-lg" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate("/patient/requests/pending")}
          className="bg-white rounded-xl p-4 border hover:shadow-md cursor-pointer"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-700 mt-1">
                {requestsLoading ? "..." : stats.pendingRequests}
              </p>
            </div>
            <div className="p-2.5 bg-yellow-100 text-yellow-600 rounded-lg">
              <FaExclamationCircle className="text-lg" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate("/notifications")}
          className="bg-white rounded-xl p-4 border hover:shadow-md cursor-pointer"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Notifications</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {requestsLoading ? "..." : stats.unreadNotifications}
              </p>
            </div>
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
              <FaBell className="text-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Requests - Takes 2/3 width */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border p-4 h-full">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recent Blood Requests</h2>
                <p className="text-gray-600 text-sm">Your recent blood donation requests</p>
              </div>
              <NavLink to="/patient/requests/all" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View All <FaArrowRight />
              </NavLink>
            </div>

            {requestsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-3">Loading...</p>
              </div>
            ) : recentRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-300 mb-3">
                  <FaHeartbeat className="text-4xl mx-auto" />
                </div>
                <p className="text-gray-500">No requests yet</p>
                <NavLink to="/patient/create/request" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
                  Create your first request →
                </NavLink>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRequests.map(req => {
                  const status = getStatusConfig(req.status);
                  return (
                    <div key={req._id} className={`p-4 rounded-lg border ${status.border} ${status.bg}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${status.badge}`}>
                              {status.icon} {status.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(req.createdAt)}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center gap-2">
                                <FaTint className="text-red-500 text-sm" />
                                <div>
                                  <p className="text-xs text-gray-600">Blood Group</p>
                                  <p className="font-bold text-red-600">{req.bloodGroup}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <FaHeartbeat className="text-blue-500 text-sm" />
                                <div>
                                  <p className="text-xs text-gray-600">Units Needed</p>
                                  <p className="font-bold text-gray-900">{req.units}</p>
                                </div>
                              </div>
                            </div>
                            
                            {req.hospital && (
                              <div className="flex items-center gap-2">
                                <FaHospital className="text-gray-500 text-sm" />
                                <p className="text-sm text-gray-700">{req.hospital}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <NavLink 
                          to={`/patient/requests/${req._id}`}
                          className="text-blue-600 hover:text-blue-700 ml-2"
                        >
                          <FaArrowRight />
                        </NavLink>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Takes 1/3 width */}
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaUserCircle className="text-blue-600" />
              <h3 className="font-bold text-gray-900">Patient Profile</h3>
            </div>
            <div className="space-y-3">
              <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Blood Group</p>
                <p className="text-2xl font-bold text-blue-700">{user?.bloodGroup || "N/A"}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-gray-50 border rounded">
                  <p className="text-xs text-gray-600">Age</p>
                  <p className="font-bold text-gray-900">{user?.age || "N/A"}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 border rounded">
                  <p className="text-xs text-gray-600">Location</p>
                  <p className="text-sm font-medium text-gray-800">{user?.city || "N/A"}</p>
                </div>
              </div>
              
              <NavLink to="/patient/profile">
                <button className="w-full mt-1 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm">
                  Edit Profile <FaArrowRight />
                </button>
              </NavLink>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <NavLink to="/patient/create/request">
                <div className="p-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm">New Blood Request</span>
                  <FaArrowRight className="text-blue-600 text-sm" />
                </div>
              </NavLink>
              
              <NavLink to="/patient/requests/all">
                <div className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm">View All Requests</span>
                  <FaArrowRight className="text-blue-600 text-sm" />
                </div>
              </NavLink>
              
              <NavLink to="/notifications">
                <div className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">Notifications</span>
                    {stats.unreadNotifications > 0 && (
                      <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {stats.unreadNotifications}
                      </span>
                    )}
                  </div>
                  <FaArrowRight className="text-blue-600 text-sm" />
                </div>
              </NavLink>
              
              <NavLink to="/patient/profile">
                <div className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm">Edit Profile</span>
                  <FaArrowRight className="text-blue-600 text-sm" />
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section - Full width at bottom */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Recent Notifications</h2>
            {stats.unreadNotifications > 0 && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                {stats.unreadNotifications} new
              </span>
            )}
          </div>
          <NavLink to="/notifications" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            View All <FaArrowRight />
          </NavLink>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {notifications.slice(0, 4).map(n => (
              <div key={n._id} className={`p-3 rounded-lg border ${n.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-medium text-sm ${n.read ? 'text-gray-800' : 'text-gray-900'}`}>
                        {n.title}
                      </p>
                      {!n.read && <span className="text-xs text-blue-600">● NEW</span>}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(n.createdAt).toLocaleString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  <div className="flex gap-1 ml-2">
                    {!n.read && (
                      <button
                        onClick={() => handleRead(n._id)}
                        className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded"
                        title="Mark as read"
                      >
                        <FaCheck size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded"
                      title="Delete"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}