/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaTint,
  FaHospital,
  FaUser,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import {
  useGetDonorMatchesQuery,
  useUpdateRequestStatusMutation,
  useCreateNotificationMutation,
} from "../../features/api/bloodApi";

export default function DonorMatchingRequests() {
  const { user } = useSelector((state) => state.auth);
  const donorId = user?.id;

  const { data, isLoading } = useGetDonorMatchesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateStatus] = useUpdateRequestStatusMutation();
  const [createNotification] = useCreateNotificationMutation(); // ✅ FIXED
  const [modalRequest, setModalRequest] = useState(null);

  const requests = data?.data || [];

  /* ----------------- HANDLERS ----------------- */
  const sendNotification = async (payload) => {
    try {
      await createNotification(payload).unwrap();
    } catch (error) {
      console.error("Notification failed:", error);
    }
  };

  const handleAccept = async (id, patientId) => {
    if (!id || !patientId) return;
    try {
      await updateStatus({ id, action: "accepted" }).unwrap();

      await sendNotification({
        patientId,
        title: "Blood Request Accepted",
        message: `${user?.name} has accepted your blood request.`,
      });

    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleCancel = async (id, patientId) => {
    if (!id || !patientId) return;
    try {
      await updateStatus({ id, action: "cancel" }).unwrap();

      await sendNotification({
        patientId,
        title: "Acceptance Cancelled",
        message: `${user?.name} cancelled the acceptance of your blood request.`,
      });

    } catch (error) {
      console.error("Error cancelling request:", error);
    }
  };

  const handleViewDetails = (req) => setModalRequest(req);
  const closeModal = () => setModalRequest(null);

  /* ----------------- UI ----------------- */
  const getStatusClasses = (status, isAcceptedByMe) => {
    if (isAcceptedByMe && status === "accepted") return "bg-green-600 text-white";
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <FaTint className="text-3xl text-red-600" />
        <h1 className="text-3xl font-bold">Matching Requests</h1>
      </motion.div>

      {isLoading && <div className="text-center text-gray-500">Loading...</div>}

      {requests.length === 0 && !isLoading && (
        <div className="p-6 bg-white rounded-xl shadow text-center text-gray-500">
          No matching requests yet.
        </div>
      )}

      <div className="space-y-5">
        {requests.map((req, idx) => {
          const isAcceptedByMe = req.acceptedBy === donorId;

          return (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start">

                {/* LEFT */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-600" />
                    <p className="text-lg font-semibold text-gray-800">
                      {req.patientId?.name || "Unknown Patient"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaHospital className="text-red-600" />
                    <p className="text-gray-700">{req.hospitalName}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaCalendarAlt />
                    {new Date(req.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-3">
                  <span className="px-4 py-1 rounded-xl text-white font-bold bg-red-500 shadow">
                    {req.bloodGroup}
                  </span>

                  <span
                    className={`px-4 py-1 rounded-xl text-sm font-bold shadow ${getStatusClasses(
                      req.status,
                      isAcceptedByMe
                    )}`}
                  >
                    {isAcceptedByMe && req.status === "accepted"
                      ? "YOU ACCEPTED"
                      : req.status.toUpperCase()}
                  </span>

                  <div className="flex gap-2 mt-2">
                    {req.status === "pending" && (
                      <>
                        <button
                          className="px-3 py-1 rounded-xl bg-green-600 text-white hover:bg-green-700 transition shadow"
                          onClick={() =>
                            handleAccept(req._id, req.patientId?._id)
                          }
                        >
                          Accept
                        </button>
                      </>
                    )}

                    {req.status === "accepted" && isAcceptedByMe && (
                      <button
                        className="px-3 py-1 rounded-xl bg-gray-600 text-white hover:bg-gray-700 transition shadow"
                        onClick={() =>
                          handleCancel(req._id, req.patientId?._id)
                        }
                      >
                        Cancel Acceptance
                      </button>
                    )}
                  </div>

                  <button
                    className="mt-2 px-3 py-1 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                    onClick={() => handleViewDetails(req)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MODAL */}
      {modalRequest && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-96 relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {modalRequest.patientId?.name}
            </h2>

            <div className="space-y-2">
              <p><strong>Blood Group:</strong> {modalRequest.bloodGroup}</p>
              <p><strong>Units Needed:</strong> {modalRequest.units}</p>
              <p><strong>Hospital:</strong> {modalRequest.hospitalName}</p>
              <p><strong>City:</strong> {modalRequest.city}</p>
              <p><strong>Emergency:</strong> {modalRequest.emergency ? "Yes" : "No"}</p>
              <p><strong>Status:</strong> {modalRequest.status.toUpperCase()}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
