/* eslint-disable no-undef */
import { useSelector } from "react-redux";
import {
  useGetPatientRequestsQuery,
  useDeleteRequestMutation,
  useUpdateRequestMutation
} from "../../features/api/bloodApi";
import { NavLink, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlusCircle,
  FaCalendarDay,
  FaHospital,
  FaMapMarkerAlt,
  FaTint,
  FaHeartbeat,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaHistory,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import { useState, useEffect } from "react";
import FlashMessage from "../FlashMessage";

export default function PatientRequests() {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, isError, refetch } = useGetPatientRequestsQuery(user?.id);
  const { status } = useParams();
  const requests = data?.data || [];

  const [deleteRequest] = useDeleteRequestMutation();
  const [updateRequest] = useUpdateRequestMutation();

  const [flash, setFlash] = useState({ show: false, type: "", message: "" });
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    hospitalName: "",
    city: "",
    units: 0
  });

  // Auto hide flash message
  useEffect(() => {
    if (flash.show) {
      const timer = setTimeout(() => {
        setFlash({ show: false, type: "", message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [flash.show]);

  const filteredRequests = () => {
    if (status === "all" || !status) return requests;
    return requests.filter(curReq => curReq?.status === status);
  };

  const sortedRequests = filteredRequests();

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    accepted: requests.filter(r => r.status === "accepted").length,
    completed: requests.filter(r => r.status === "completed").length,
    rejected: requests.filter(r => r.status === "rejected").length
  };

  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: <FaClock className="inline mr-1" /> },
    accepted: { color: "bg-blue-100 text-blue-800 border-blue-300", icon: <FaCheckCircle className="inline mr-1" /> },
    completed: { color: "bg-green-100 text-green-800 border-green-300", icon: "🎉" },
    rejected: { color: "bg-red-100 text-red-800 border-red-300", icon: "🚫" },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleDelete = async (requestId, requestStatus) => {
    if (requestStatus === 'completed') {
      setFlash({ show: true, type: "error", message: "Completed requests cannot be deleted." });
      return;
    }

    const message = requestStatus === 'accepted'
      ? "Are you sure? This will cancel the request and notify matched donors."
      : "Are you sure you want to delete this request?";

    if (!window.confirm(message)) return;

    setDeletingId(requestId);
    try {
      await deleteRequest(requestId).unwrap();
      setFlash({ show: true, type: "success", message: "Request deleted successfully!" });
      refetch();
    } catch (error) {
      setFlash({ show: true, type: "error", message: error?.data?.message || "Failed to delete request." });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (request) => {
    if (request.status !== 'pending') {
      setFlash({ show: true, type: "error", message: "Only pending requests can be edited." });
      return;
    }

    setEditingId(request._id);
    setEditForm({
      hospitalName: request.hospitalName || request.hospital || "",
      city: request.city || "",
      units: request.units || 1
    });
  };

  const handleSaveEdit = async (requestId) => {
    if (!editForm.hospitalName.trim() || !editForm.city.trim() || editForm.units < 1) {
      setFlash({ show: true, type: "error", message: "Please fill all fields correctly." });
      return;
    }

    try {
      await updateRequest({
        id: requestId,
        ...editForm
      }).unwrap();

      setFlash({ show: true, type: "success", message: "Request updated successfully!" });
      setEditingId(null);
      refetch();
    } catch (error) {
      setFlash({ show: true, type: "error", message: error?.data?.message || "Failed to update request." });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ hospitalName: "", city: "", units: 0 });
  };

  const statusTabs = [
    { id: "all", label: "All Requests", count: stats.total, icon: <FaHeartbeat /> },
    { id: "pending", label: "Pending", count: stats.pending, icon: <FaClock /> },
    { id: "accepted", label: "Accepted", count: stats.accepted, icon: <FaCheckCircle /> },
    { id: "completed", label: "Completed", count: stats.completed, icon: <FaHistory /> },
    { id: "rejected", label: "Rejected", count: stats.rejected, icon: <FaExclamationCircle /> }
  ];

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-700 mb-2">Failed to Load</h3>
          <p className="text-red-600 mb-4">Unable to fetch requests</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Flash Message */}
      {flash.show && (
        <FlashMessage
          type={flash.type}
          message={flash.message}
          onClose={() => setFlash({ show: false, type: "", message: "" })}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <NavLink to="/patient/dashboard">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <FaArrowLeft className="text-gray-600 text-lg" />
              </button>
            </NavLink>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaHeartbeat className="text-xl text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Your Blood Requests</h1>
                  <p className="text-gray-600 text-sm">Track all your blood donation requests</p>
                </div>
              </div>
            </div>
          </div>
          <NavLink to="/patient/create/request">
            <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
              <FaPlusCircle /> New Request
            </button>
          </NavLink>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {statusTabs.map(tab => (
            <NavLink
              key={tab.id}
              to={`/patient/requests/${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${(status === tab.id || (!status && tab.id === "all"))
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-xs ${(status === tab.id || (!status && tab.id === "all"))
                ? 'bg-blue-500'
                : 'bg-gray-200 text-gray-700'
                }`}>
                {tab.count}
              </span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* EMPTY STATE */}
      {!isLoading && sortedRequests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border">
          <div className="text-gray-300 mb-4">
            <FaHeartbeat className="text-5xl mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No requests found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {status === "all" || !status
              ? "You haven't created any blood requests yet."
              : `No ${status} requests found.`
            }
          </p>
          <NavLink to="/patient/create/request">
            <button className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
              <FaPlusCircle className="inline mr-2" />
              Create Your First Request
            </button>
          </NavLink>
        </div>
      )}

      {/* REQUEST LIST */}
      {!isLoading && sortedRequests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedRequests.map((req) => {
            const config = statusConfig[req.status] || statusConfig.pending;
            return (
              <div key={req._id} className="bg-white rounded-xl border hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <FaTint className="text-red-600 text-sm" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{req.bloodGroup} Blood Request</h3>
                          <p className="text-xs text-gray-500">Click to view details</p>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
                      {config.icon} {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </div>

                  {editingId === req._id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <FaTint className="text-red-500" />
                          <div>
                            <p className="text-xs text-gray-600">Blood Group</p>
                            <p className="font-bold text-red-600">{req.bloodGroup}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaHeartbeat className="text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-600">Units Needed</p>
                            <input
                              type="number"
                              min="1"
                              value={editForm.units}
                              onChange={(e) => setEditForm({ ...editForm, units: parseInt(e.target.value) || 1 })}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaHospital className="text-gray-500" />
                        <input
                          type="text"
                          placeholder="Hospital Name"
                          value={editForm.hospitalName}
                          onChange={(e) => setEditForm({ ...editForm, hospitalName: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-500" />
                        <input
                          type="text"
                          placeholder="City"
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarDay className="text-gray-500" />
                        <p className="text-xs text-gray-600">Requested {formatDate(req.createdAt)}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => handleSaveEdit(req._id)} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                          Save Changes
                        </button>
                        <button onClick={handleCancelEdit} className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <FaTint className="text-red-500" />
                          <div>
                            <p className="text-xs text-gray-600">Blood Group</p>
                            <p className="font-bold text-red-600">{req.bloodGroup}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaHeartbeat className="text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-600">Units Needed</p>
                            <p className="font-bold text-gray-900">{req.units} unit(s)</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaHospital className="text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-600">Hospital</p>
                          <p className="text-sm text-gray-900">{req.hospitalName || req.hospital || "Not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-600">Location</p>
                          <p className="text-sm text-gray-900">{req.city || "Location not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarDay className="text-gray-500" />
                        <p className="text-xs text-gray-600">Requested {formatDate(req.createdAt)}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-5 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {req.emergency && (
                        <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-200">🚨 Emergency</span>
                      )}
                      {(req.status === 'pending' || req.status === 'accepted') && editingId !== req._id && (
                        <div className="flex gap-2">
                          <button onClick={() => handleEditClick(req)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(req._id, req.status)} disabled={deletingId === req._id} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50" title="Delete">
                            {deletingId === req._id ? <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div> : <FaTrash />}
                          </button>
                        </div>
                      )}
                    </div>
                    <NavLink to={`/patient/request-details/${req._id}`} className="flex items-center text-blue-600 text-sm hover:text-blue-700">
                      View Details <FaArrowRight className="ml-2" />
                    </NavLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}