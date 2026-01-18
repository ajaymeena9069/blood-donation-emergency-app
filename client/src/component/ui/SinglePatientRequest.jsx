import { useParams, useNavigate } from "react-router-dom";
import {
  FaTint, FaArrowLeft, FaHospital,
  FaUser, FaMapMarkerAlt, FaExclamationTriangle,
  FaPhone, FaEnvelope, FaCheckCircle,
  FaHeartbeat, FaUsers, FaClock,
  FaInfoCircle, FaFileMedical
} from "react-icons/fa";
import { useGetSingleRequestQuery } from "../../features/api/bloodApi";

export default function SinglePatientRequest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSingleRequestQuery(id);
  const request = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <p className="text-lg text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md border">
          <div className="text-gray-400 text-6xl mb-4">🩸</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Request Not Found</h2>
          <p className="text-gray-500 mb-6">The blood request doesn't exist or was removed.</p>
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
      badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: "⏳",
      label: "Pending"
    },
    accepted: {
      badge: "bg-blue-100 text-blue-800 border-blue-300",
      icon: "✅",
      label: "Accepted"
    },
    completed: {
      badge: "bg-green-100 text-green-800 border-green-300",
      icon: "🎉",
      label: "Completed"
    },
    rejected: {
      badge: "bg-red-100 text-red-800 border-red-300",
      icon: "❌",
      label: "Rejected"
    },
    cancelled: {
      badge: "bg-gray-100 text-gray-800 border-gray-300",
      icon: "🚫",
      label: "Cancelled"
    },
  };

  const statusInfo = statusConfig[request.status] || statusConfig.pending;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg border hover:bg-gray-50 transition-all text-gray-700 font-medium"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl border">
          {/* Header Section */}
          <div className="border-b p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <FaHeartbeat className="text-2xl text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Blood Request Details</h1>
                  <p className="text-gray-600 mt-1">Request ID: {request._id?.substring(request._id.length - 8)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${statusInfo.badge}`}>
                  <span>{statusInfo.icon}</span>
                  {statusInfo.label}
                </span>
                {request.emergency && (
                  <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-2">
                    <FaExclamationTriangle />
                    EMERGENCY
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FaTint className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="text-xl font-bold text-red-700">{request.bloodGroup}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaHeartbeat className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Units Required</p>
                    <p className="text-xl font-bold text-blue-700">{request.units} unit{request.units > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaMapMarkerAlt className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-lg font-bold text-green-700">{request.city}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FaClock className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created On</p>
                    <p className="text-sm font-bold text-purple-700">{formatDate(request.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Hospital Details */}
                <div className="bg-white border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaHospital className="text-blue-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Hospital Information</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FaHospital className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Hospital Name</p>
                        <p className="font-medium text-gray-900">{request.hospitalName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">City</p>
                        <p className="font-medium text-gray-900">{request.city}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaFileMedical className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Emergency Status</p>
                        <p className={`font-medium ${request.emergency ? 'text-red-600' : 'text-gray-900'}`}>
                          {request.emergency ? 'Yes - Urgent Need' : 'No - Regular Request'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FaClock className="text-purple-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Timeline</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <FaCheckCircle className="text-green-600 text-sm" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Request Created</p>
                        <p className="text-sm text-gray-600">{formatDate(request.createdAt)}</p>
                      </div>
                    </div>

                    {request.acceptedAt && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <FaUsers className="text-blue-600 text-sm" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Request Accepted</p>
                          <p className="text-sm text-gray-600">{formatDate(request.acceptedAt)}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <FaClock className="text-gray-600 text-sm" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Last Updated</p>
                        <p className="text-sm text-gray-600">{formatDate(request.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Patient Details */}
                <div className="bg-white border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaUser className="text-green-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Patient Details</h2>
                  </div>

                  {request.patientId ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <FaUser className="text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium text-gray-900">{request.patientId.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FaEnvelope className="text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900 break-all">{request.patientId.email}</p>
                        </div>
                      </div>

                      {request.patientId.phone && (
                        <div className="flex items-start gap-3">
                          <FaPhone className="text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">{request.patientId.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Patient details not available</p>
                  )}
                </div>

                {/* Additional Info */}
                <div className="bg-white border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <FaInfoCircle className="text-yellow-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Additional Information</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Donor Responses */}
                    {request.donorResponses && request.donorResponses.length > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-700 flex items-center gap-2">
                          <FaUsers />
                          Donor Responses: {request.donorResponses.length}
                        </p>
                      </div>
                    )}

                    {/* Accepted By */}
                    {request.acceptedBy && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                          <FaCheckCircle />
                          Accepted By: {request.acceptedBy.name}
                        </p>
                      </div>
                    )}

                    {/* Status Notes */}
                    <div className={`p-3 rounded-lg ${statusInfo.badge.replace('border', 'bg').replace('300', '50')} border ${statusInfo.badge.split(' ')[2]}`}>
                      <p className="text-sm">
                        {request.status === 'pending' && 'Your request is being processed and donors are being notified.'}
                        {request.status === 'accepted' && 'A donor has accepted your request and will contact you shortly.'}
                        {request.status === 'completed' && 'This blood request has been successfully fulfilled.'}
                        {request.status === 'rejected' && 'This request has been rejected.'}
                        {request.status === 'cancelled' && 'This request has been cancelled.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="mt-8 pt-6 border-t">
              <button
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Go Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}