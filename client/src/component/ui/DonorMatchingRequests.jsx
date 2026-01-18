import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTint, FaHospital, FaUser, FaCalendarAlt, FaMapMarkerAlt,
  FaCheckCircle, FaTimesCircle, FaHeartbeat, FaInfoCircle,
  FaArrowLeft, FaHistory, FaClock, FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";
import {
  useGetDonorMatchesQuery,
  useAcceptRequestMutation,
  useCancelRequestMutation
} from "../../features/api/bloodApi";
import FlashMessage from "../FlashMessage";
export default function DonorMatchingRequests() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [flash, setFlash] = useState({ type: "", message: "" });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelData, setCancelData] = useState({ id: "", patientName: "", bloodGroup: "" });
  const [reason, setReason] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status") || "all";

  const { data, isLoading, isError, error, refetch } = useGetDonorMatchesQuery();
  const [accept, { isLoading: isAccepting }] = useAcceptRequestMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelRequestMutation();

  const requests = data?.data || [];
  const donorId = user?._id;

  // --- LOGIC START ---

  // Since you said backend already validates the donor for accepted requests, 
  // we simply filter by the 'status' from URL params.
  const filteredRequests = status === 'all'
    ? requests
    : requests.filter(req => req.status === status);

  // Calculate stats in a single pass for better performance
  const stats = requests.reduce((acc, req) => {
    acc.total++;
    if (req.status === 'pending') acc.pending++;
    if (req.status === 'accepted') acc.accepted++;
    if (req.status === 'completed') acc.completed++;
    return acc;
  }, { total: 0, pending: 0, accepted: 0, completed: 0 });

  // --- LOGIC END ---

  const tabs = [
    { id: "all", label: "All", count: stats.total, icon: <FaHeartbeat /> },
    { id: "pending", label: "Pending", count: stats.pending, icon: <FaClock /> },
    { id: "accepted", label: "Accepted", count: stats.accepted, icon: <FaCheckCircle /> },
    { id: "completed", label: "Completed", count: stats.completed, icon: <FaHistory /> }
  ];

  const getStatusBadge = (reqStatus, isEmergency) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    if (isEmergency) return `${base} bg-red-100 text-red-800 border border-red-300`;

    const configs = {
      pending: `${base} bg-yellow-100 text-yellow-800 border border-yellow-300`,
      accepted: `${base} bg-blue-100 text-blue-800 border border-blue-300`,
      completed: `${base} bg-green-100 text-green-800 border border-green-300`,
    };
    return configs[reqStatus] || `${base} bg-gray-100 text-gray-800 border border-gray-300`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleAccept = async (id, patientName, bloodGroup) => {
    try {
      const result = await accept(id).unwrap();
      if (result.success) {
        setFlash({
          show: true,
          type: "success",
          message: `✅ Accepted ${patientName}'s ${bloodGroup} request!`
        });
        refetch();
      }
    } catch (err) {
      setFlash({
        show: true,
        type: "error",
        message: err?.data?.message || err?.error?.data?.message || "Accept failed"
      });
    }
  };

  const handleCancel = async () => {
    if (reason.length < 10) {
      setFlash({ show: true, type: "error", message: "❌ Reason must be at least 10 characters" });
      return;
    }
    try {
      const result = await cancel({ id: cancelData.id, reason }).unwrap();
      if (result.success) {
        setFlash({ show: true, type: "success", message: `✅ Cancelled ${cancelData.patientName}'s request` });
        setShowCancelModal(false);
        setReason("");
        refetch();
      }
    } catch (err) {
      setFlash({ show: true, type: "error", message: err?.data?.message || "Cancel failed" });
    }
  };

  const openCancel = (id, patientName, bloodGroup) => {
    setCancelData({ id, patientName, bloodGroup });
    setShowCancelModal(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-700 mb-2">Failed to Load</h3>
          <p className="text-red-600 mb-4">{error?.data?.message || "Unable to fetch requests"}</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClose={() => setFlash({ show: false, type: "", message: "" })}
      />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/donor/dashboard")} className="p-2 hover:bg-gray-100 rounded-lg">
              <FaArrowLeft className="text-gray-600 text-lg" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <FaHeartbeat className="text-xl text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Matching Blood Requests</h1>
                <p className="text-gray-600 text-sm">Patients needing your {user?.bloodGroup} blood</p>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <FaInfoCircle className="inline mr-1" />
            {filteredRequests.length} showing
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => navigate(`/donor/matches?status=${tab.id}`)}
              disabled={isAccepting || isCancelling}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${status === tab.id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {tab.icon} <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-xs ${status === tab.id ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <FaHeartbeat className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No matching requests</h3>
          <p className="text-gray-600">
            {status === "all" ? "No requests found at the moment." : `No ${status} requests found.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((req, idx) => {
            const patientName = req.patientName || req.patientId?.name || "Anonymous";
            const canAccept = req.status === "pending";
            const canCancel = req.status === "accepted";

            return (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border hover:shadow-lg transition-shadow overflow-hidden"
              >
                {req.emergency && (
                  <div className="bg-red-600 text-white py-2 px-4 flex items-center gap-2">
                    <FaExclamationTriangle className="animate-pulse" />
                    <span className="font-bold text-sm">EMERGENCY</span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{patientName}</h3>
                        <p className="text-xs text-gray-500">Patient</p>
                      </div>
                    </div>
                    <span className={getStatusBadge(req.status, req.emergency)}>
                      {req.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <FaTint className="text-red-500" />
                        <div>
                          <p className="text-xs text-gray-600">Blood Group</p>
                          <p className="font-bold text-red-600">{req.bloodGroup}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-600">Units</p>
                          <p className="font-bold text-gray-900">{req.units}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaHospital className="text-gray-400" />
                      <p className="text-sm">{req.hospitalName || "Hospital not specified"}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <p className="text-sm">{req.city || "Location not specified"}</p>
                    </div>
                    <div className="text-xs text-gray-500 pt-1">
                      Requested {formatDate(req.createdAt)}
                    </div>
                    {req.status === "accepted" && req.acceptedAt && (
                      <div className="text-xs text-green-600 font-medium bg-green-50 p-2 rounded">
                        ✅ You accepted this on {formatDate(req.acceptedAt)}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      {canAccept && (
                        <button
                          onClick={() => handleAccept(req._id, patientName, req.bloodGroup)}
                          disabled={isAccepting || isCancelling}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm disabled:opacity-50 transition-colors"
                        >
                          {isAccepting ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                          {isAccepting ? "Accepting..." : "Accept Request"}
                        </button>
                      )}

                      {canCancel && (
                        <button
                          onClick={() => openCancel(req._id, patientName, req.bloodGroup)}
                          disabled={isAccepting || isCancelling}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm disabled:opacity-50 transition-colors"
                        >
                          <FaTimesCircle /> Cancel Acceptance
                        </button>
                      )}

                      {req.status === "completed" && (
                        <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm text-center font-medium">
                          <FaCheckCircle className="inline mr-2 text-green-600" />
                          Donation Completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaTimesCircle className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Cancel Acceptance</h3>
            </div>

            <p className="text-gray-600 mb-4">
              Cancelling <span className="font-semibold text-gray-900">{cancelData.patientName}'s</span>{" "}
              <span className="text-red-600 font-bold">{cancelData.bloodGroup}</span> request.
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason (min 10 characters)..."
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-3 transition-all"
              minLength={10}
              disabled={isCancelling}
            />

            {reason.length > 0 && reason.length < 10 && (
              <p className="text-red-600 text-xs mb-3 italic">Need {10 - reason.length} more characters...</p>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowCancelModal(false); setReason(""); }}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleCancel}
                disabled={reason.length < 10 || isCancelling}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${reason.length >= 10 && !isCancelling ? 'bg-red-600 text-white hover:bg-red-700 shadow-md active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                {isCancelling ? <FaSpinner className="animate-spin inline mr-2" /> : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}