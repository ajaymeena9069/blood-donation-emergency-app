import { useParams, useNavigate } from "react-router-dom";
import { FaTint, FaClock, FaArrowLeft, FaHospital, FaUser, FaMapMarkerAlt, FaExclamationTriangle, FaCalendarDay, FaPhone, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useGetSingleRequestQuery } from "../../features/api/bloodApi";

export default function SinglePatientRequest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSingleRequestQuery(id);
  const req = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <p className="text-lg text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!req) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="text-gray-400 text-6xl mb-4">🩸</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Request Not Found</h2>
          <p className="text-gray-500 mb-6">The blood request you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: { 
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: "⏳",
      label: "Pending"
    },
    accepted: { 
      color: "bg-blue-100 text-blue-800 border-blue-300",
      icon: "✅",
      label: "Accepted"
    },
    completed: { 
      color: "bg-green-100 text-green-800 border-green-300",
      icon: "🎉",
      label: "Completed"
    },
    rejected: { 
      color: "bg-red-100 text-red-800 border-red-300",
      icon: "❌",
      label: "Rejected"
    },
    cancel: { 
      color: "bg-gray-100 text-gray-800 border-gray-300",
      icon: "🚫",
      label: "Cancelled"
    },
  };

  const statusInfo = statusConfig[req.status] || statusConfig.pending;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-red-50 to-white py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-3 mb-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:bg-gray-50 text-gray-700 font-medium"
        >
          <FaArrowLeft />
          Back to Requests
        </button>

        {/* Main Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaTint className="text-3xl text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                    Blood Request: <span className="text-white">{req.bloodGroup}</span>
                  </h1>
                  <p className="text-red-100 mt-1">
                    Created on {formatDate(req.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${statusInfo.color} border`}>
                  <span>{statusInfo.icon}</span>
                  {statusInfo.label}
                </span>
                {req.emergency && (
                  <span className="px-4 py-2 bg-white text-red-600 rounded-full font-bold text-sm flex items-center gap-2 animate-pulse">
                    <FaExclamationTriangle />
                    URGENT
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 md:p-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">{req.bloodGroup}</p>
                  </div>
                  <FaTint className="text-2xl text-red-500 opacity-80" />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Units Required</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{req.units} units</p>
                  </div>
                  <FaTint className="text-2xl text-blue-500 opacity-80" />
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-lg font-bold text-green-600 mt-1">{req.city}</p>
                  </div>
                  <FaMapMarkerAlt className="text-2xl text-green-500 opacity-80" />
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Emergency</p>
                    <p className="text-lg font-bold text-purple-600 mt-1">{req.emergency ? "Yes" : "No"}</p>
                  </div>
                  <FaExclamationTriangle className="text-2xl text-purple-500 opacity-80" />
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Hospital Details Card */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaHospital className="text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Hospital Details</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8">
                      <span className="text-gray-500">🏥</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hospital Name</p>
                      <p className="font-medium">{req.hospitalName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8">
                      <FaMapMarkerAlt className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{req.city}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8">
                      <FaCalendarDay className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium">{formatDate(req.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Patient Details Card */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaUser className="text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Patient Details</h2>
                </div>
                
                {req.patientId ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8">
                        <FaUser className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{req.patientId.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8">
                        <FaEnvelope className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium break-all">{req.patientId.email}</p>
                      </div>
                    </div>
                    
                    {req.patientId.phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-8">
                          <FaPhone className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{req.patientId.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Patient ID</p>
                      <p className="text-xs font-mono text-gray-500 break-all mt-1">{req.patientId._id}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Patient details not available</p>
                )}
              </motion.div>
            </div>

            {/* Timeline Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaClock className="text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Request Timeline</h2>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                {/* Timeline Steps */}
                <div className="space-y-8">
                  {/* Step 1: Request Created */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      ["pending", "accepted", "completed", "rejected", "cancel"].includes(req.status)
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}>
                      <FaCheckCircle className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Request Created</h3>
                      <p className="text-gray-600 mt-1">Your blood request was successfully created and submitted.</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {formatDate(req.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Searching Donors */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      ["accepted", "completed"].includes(req.status)
                        ? "bg-green-100 text-green-600"
                        : req.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-400"
                    }`}>
                      <span className="text-xl">🔍</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Searching Donors</h3>
                      <p className="text-gray-600 mt-1">
                        {req.status === "pending" 
                          ? "Currently searching for matching blood donors in your area."
                          : req.status === "accepted" || req.status === "completed"
                          ? "Matching donors were found and notified."
                          : "Searching for matching donors."
                        }
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Donor Response */}
                  {["accepted", "completed", "rejected", "cancel"].includes(req.status) && (
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        req.status === "accepted" || req.status === "completed"
                          ? "bg-blue-100 text-blue-600"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        <span className="text-xl">
                          {req.status === "accepted" || req.status === "completed" ? "✅" : 
                           req.status === "rejected" ? "❌" : "🚫"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {req.status === "accepted" ? "Donor Accepted" :
                           req.status === "completed" ? "Completed" :
                           req.status === "rejected" ? "Rejected" : "Cancelled"}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {req.status === "accepted" 
                            ? "A donor has accepted your request and will contact you soon."
                            : req.status === "completed"
                            ? "The blood donation has been successfully completed."
                            : req.status === "rejected"
                            ? "The request has been rejected."
                            : "The request has been cancelled."
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}