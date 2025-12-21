import { useSelector } from "react-redux";
import { useGetPatientRequestsQuery } from "../../features/api/bloodApi";
import { NavLink, useParams } from "react-router-dom";
import { FaArrowLeft, FaPlusCircle, FaCalendarDay, FaHospital, FaMapMarkerAlt, FaTint } from "react-icons/fa";
import { useState } from "react";
import FlashMessage, { getMessage } from "../FlashMessage";

export default function PatientRequests() {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useGetPatientRequestsQuery(user?.id);
  const { status } = useParams();
  const requests = data?.data || [];
  console.log(status);
  function dynamicFiltering() {
    if (status === "all") {
      return requests;
    } else if (status === "pending") {
      return requests?.filter((curReq) => curReq?.status === status);
    } else {
      return requests.filter((curReq) => curReq?.status === status);
    }
  }

  const sortedRequest = dynamicFiltering();
  // FlashMessage state
  const [flash, setFlash] = useState({
    type: "",
    msg: "",
  });


  // Status configuration
  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: "⏳",
    },
    accepted: {
      color: "bg-blue-100 text-blue-800 border-blue-300",
      icon: "✅",
    },
    completed: {
      color: "bg-green-100 text-green-800 border-green-300",
      icon: "🎉",
    },
    cancel: {
      color: "bg-red-100 text-red-800 border-red-300",
      icon: "❌",
    },
    rejected: {
      color: "bg-gray-100 text-gray-800 border-gray-300",
      icon: "🚫",
    },
  };

  // Show message on error
  if (isError && !flash.msg) {
    setFlash({
      type: "error",
      msg: getMessage("general", "error"),
    });
  }

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      {/* Flash Message Component */}
      <FlashMessage
        type={flash.type}
        message={flash.msg}
        onClose={() => setFlash({ type: "", msg: "" })}
      />

      {/* Header */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <NavLink to="/patient/dashboard">
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition mb-4 text-gray-700">
                <FaArrowLeft /> Back to Dashboard
              </button>
            </NavLink>
            <h1 className="text-3xl font-bold text-gray-800">Your Blood Requests</h1>
            <p className="text-gray-600 mt-2">
              Track all your blood donation requests
            </p>
          </div>

          <NavLink to="/patient/create/request">
            <button className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-md">
              <FaPlusCircle /> New Request
            </button>
          </NavLink>
        </div>

        {/* Stats Summary */}
        {/* This feature will may be implement in future */}
        {/* {requests.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{requests.length}</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === "completed").length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === "pending").length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">Loading your requests...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && requests.length === 0 && (
        <div className="text-center mt-16 bg-white rounded-2xl p-10 shadow-sm border">
          <div className="text-gray-400 mb-5">
            <FaTint className="text-6xl mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-3">
            No Requests Found
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            You haven't created any blood requests yet. Create your first request to get started.
          </p>
          <NavLink to="/patient/create/request">
            <button className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-md font-medium">
              Create Your First Request
            </button>
          </NavLink>
        </div>
      )}

      {/* REQUEST LIST */}
      {!isLoading && requests.length > 0 && (
        <div className="space-y-4">
          {sortedRequest?.map((req) => {
            const status = statusConfig[req.status] || statusConfig.pending;
            return (
              <NavLink to={`/patient/request-details/${req?._id}`} key={req._id}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-red-200 transition-all p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <FaTint className="text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {req.bloodGroup} Blood Request
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <FaHospital className="text-gray-500 text-sm" />
                          <span className="text-gray-700">{req.hospitalName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-500 text-sm" />
                          <span className="text-gray-700">{req.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarDay className="text-gray-500 text-sm" />
                          <span className="text-gray-700">{formatDate(req.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {req.units} unit{req.units !== 1 ? 's' : ''}
                        </span>
                        {req.emergency && (
                          <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                            Emergency
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end">
                      <span className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${status.color} border`}>
                        <span>{status.icon}</span>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                      <p className="text-sm text-gray-500 mt-2 text-right">
                        Click to view details
                      </p>
                    </div>
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      )}

      {/* Tips Section - Only show if there are requests */}
      {requests.length > 0 && (
        <div className="mt-10 bg-red-50 rounded-xl p-5 border border-red-100">
          <h3 className="text-lg font-bold text-red-700 mb-3">
            Quick Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-lg">
              <h4 className="font-semibold mb-1">Track Status</h4>
              <p className="text-sm text-gray-600">
                Click on any request to see detailed status and timeline.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <h4 className="font-semibold mb-1">Get Updates</h4>
              <p className="text-sm text-gray-600">
                You'll receive notifications when donors accept your requests.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <h4 className="font-semibold mb-1">Multiple Requests</h4>
              <p className="text-sm text-gray-600">
                You can create multiple requests for different needs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}