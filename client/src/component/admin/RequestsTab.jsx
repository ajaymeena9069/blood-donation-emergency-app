import React, { useState } from "react";
import {
    FaFilter, FaDownload, FaTrashAlt, FaEye, FaEdit,
    FaSearch, FaChevronLeft, FaChevronRight, FaTint,
    FaClock, FaCheckCircle, FaExclamationTriangle, FaMapMarkerAlt,
    FaHospital, FaHeartbeat
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
    useAdminDeleteRequestMutation,
    useAdminUpdateRequestStatusMutation,
    useAdminBulkDeleteRequestsMutation
} from "../../features/api/bloodApi";
import ViewRequestModal from "../common/Modals/ViewRequestModal";
import UpdateStatusModal from "../common/Modals/UpdateStatusModal";
import BulkDeleteModal from "../common/Modals/BulkDeleteModal";
import Pagination from "../common/Tables/Pagination";
import RequestFilters from "../common/Filters/RequestFilters";

export default function RequestsTab({ requests, onRefresh, onStatsRefresh, setFlash }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
    const [selectedRequests, setSelectedRequests] = useState([]);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const itemsPerPage = 10;

    const [deleteRequest, { isLoading: isDeleting }] = useAdminDeleteRequestMutation();
    const [updateRequestStatus, { isLoading: isUpdating }] = useAdminUpdateRequestStatusMutation();
    const [bulkDeleteRequests] = useAdminBulkDeleteRequestsMutation();

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'completed': return 'bg-green-100 text-green-700 border-green-300';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    // Filter requests
    const statusFilteredRequests = statusFilter === 'all'
        ? requests
        : requests.filter(r => r.status === statusFilter);

    const filteredRequests = statusFilteredRequests.filter(req =>
        req.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

    const handleDeleteRequest = (request) => {
        setSelectedRequest(request);
        setShowDeleteModal(true);
    };

    const confirmDeleteRequest = async () => {
        try {
            await deleteRequest(selectedRequest._id).unwrap();
            setFlash({ type: "success", message: "Request deleted successfully" });
            onRefresh();
            onStatsRefresh();
            setShowDeleteModal(false);
            setSelectedRequest(null);
        } catch (error) {
            setFlash({ type: "error", message: "Failed to delete request" });
        }
    };

    const handleViewRequest = (request) => {
        setSelectedRequest(request);
        setShowViewModal(true);
    };

    const handleUpdateStatus = (request) => {
        setSelectedRequest(request);
        setShowUpdateStatusModal(true);
    };

    const handleUpdateRequestStatus = async (status, rejectionReason) => {
        try {
            const payload = { id: selectedRequest._id, status };
            if (status === 'rejected' && rejectionReason) {
                payload.rejectionReason = rejectionReason;
            }
            await updateRequestStatus(payload).unwrap();
            setShowUpdateStatusModal(false);
            setSelectedRequest(null);
            setFlash({ type: "success", message: "Request status updated successfully" });
            onRefresh();
            onStatsRefresh();
        } catch (error) {
            setFlash({ type: "error", message: error?.data?.message || "Failed to update status" });
        }
    };

    const handleSelectRequest = (requestId) => {
        setSelectedRequests(prev =>
            prev.includes(requestId) ? prev.filter(id => id !== requestId) : [...prev, requestId]
        );
    };

    const handleSelectAllRequests = () => {
        if (selectedRequests.length === paginatedRequests.length) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(paginatedRequests.map(r => r._id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedRequests.length === 0) {
            setFlash({ type: "error", message: "Please select requests to delete" });
            return;
        }
        setShowBulkDeleteModal(true);
    };

    const confirmBulkDelete = async () => {
        try {
            await bulkDeleteRequests(selectedRequests).unwrap();
            setFlash({ type: "success", message: `${selectedRequests.length} requests deleted successfully` });
            setSelectedRequests([]);
            onRefresh();
            onStatsRefresh();
            setShowBulkDeleteModal(false);
        } catch (error) {
            setFlash({ type: "error", message: error?.data?.message || "Failed to delete" });
        }
    };

    return (
        <div className="space-y-4">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Blood Requests</h2>

                <div className="flex items-center gap-2">
                    {selectedRequests.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-red-700"
                        >
                            <FaTrashAlt className="text-xs" />
                            Delete ({selectedRequests.length})
                        </button>
                    )}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <FaFilter className="text-xs" />
                        Filters
                    </button>
                    <button
                        onClick={() => setFlash({ type: "info", message: "📊 Export feature coming soon! Stay tuned for CSV/Excel export functionality." })}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <FaDownload className="text-xs" />
                        Export
                    </button>
                </div>
            </div>

            {/* Filters */}
            <RequestFilters
                show={showFilters}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
            />

            {/* Select All Checkbox */}
            {paginatedRequests.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                        type="checkbox"
                        checked={selectedRequests.length === paginatedRequests.length}
                        onChange={handleSelectAllRequests}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        {selectedRequests.length > 0 ? `${selectedRequests.length} selected` : 'Select All'}
                    </span>
                </div>
            )}

            {/* Requests List */}
            {paginatedRequests.length === 0 ? (
                <div className="text-center py-12">
                    <FaTint className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No requests found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {paginatedRequests.map((req) => (
                        <motion.div
                            key={req._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start gap-3">
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={selectedRequests.includes(req._id)}
                                    onChange={() => handleSelectRequest(req._id)}
                                    className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />

                                <div className="flex-1 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${req.emergency ? 'bg-red-100' : 'bg-gray-100'}`}>
                                                {req.emergency ? (
                                                    <FaExclamationTriangle className="text-red-600 text-xl" />
                                                ) : (
                                                    <FaTint className="text-red-600 text-xl" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className="font-semibold text-gray-900">{req.patientId?.name || 'Unknown'}</h4>
                                                    {req.emergency && (
                                                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                                                            Emergency
                                                        </span>
                                                    )}
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(req.status)}`}>
                                                        {req.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <FaClock />
                                                    {new Date(req.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="bg-gray-50 p-2 rounded">
                                                <p className="text-xs text-gray-500">Blood Group</p>
                                                <p className="font-bold text-red-600">{req.bloodGroup}</p>
                                            </div>
                                            <div className="bg-gray-50 p-2 rounded">
                                                <p className="text-xs text-gray-500">Units</p>
                                                <p className="font-bold">{req.units || 'N/A'}</p>
                                            </div>
                                            <div className="bg-gray-50 p-2 rounded col-span-2">
                                                <p className="text-xs text-gray-500">Hospital</p>
                                                <p className="font-medium truncate">{req.hospitalName || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{req.city || 'N/A'}</p>
                                            </div>
                                        </div>

                                        {req.acceptedBy && (
                                            <div className="mt-3 p-2 bg-blue-50 rounded-lg flex items-center gap-2">
                                                <FaCheckCircle className="text-blue-600 text-xs" />
                                                <p className="text-xs text-blue-700">
                                                    Accepted by: <span className="font-medium">{req.acceptedBy?.name}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex lg:flex-col gap-2">
                                        <button
                                            onClick={() => handleViewRequest(req)}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium flex items-center gap-1 justify-center transition-colors"
                                        >
                                            <FaEye /> View
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(req)}
                                            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs font-medium flex items-center gap-1 justify-center transition-colors"
                                        >
                                            <FaEdit /> Status
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRequest(req)}
                                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-medium flex items-center gap-1 justify-center transition-colors"
                                        >
                                            <FaTrashAlt /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Modals */}
            <ViewRequestModal
                isOpen={showViewModal}
                onClose={() => {
                    setShowViewModal(false);
                    setSelectedRequest(null);
                }}
                request={selectedRequest}
            />

            <UpdateStatusModal
                isOpen={showUpdateStatusModal}
                onClose={() => {
                    setShowUpdateStatusModal(false);
                    setSelectedRequest(null);
                }}
                onUpdate={handleUpdateRequestStatus}
                request={selectedRequest}
                isLoading={isUpdating}
            />

            <BulkDeleteModal
                isOpen={showBulkDeleteModal}
                onClose={() => {
                    setShowBulkDeleteModal(false);
                    setBulkDeleteType('');
                }}
                onConfirm={confirmBulkDelete}
                count={selectedRequests.length}
                type="requests"
            />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTrashAlt className="text-3xl text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Request</h3>
                            <p className="text-gray-600 mb-2">
                                Are you sure you want to delete this blood request?
                            </p>
                            <p className="text-sm text-red-600 mb-6">
                                This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedRequest(null);
                                    }}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteRequest}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 font-semibold transition shadow-md disabled:opacity-50"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Request'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}