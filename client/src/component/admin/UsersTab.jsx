import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
    FaFilter, FaDownload, FaTrashAlt, FaEye, FaEdit,
    FaSearch, FaChevronLeft, FaChevronRight, FaUserPlus,
    FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeartbeat,
    FaUserMd, FaUserShield, FaUserCircle, FaCalendarCheck,
    FaCheckCircle
} from "react-icons/fa";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import {
    useAdminUpdateUserStatusMutation,
    useAdminDeleteUserMutation,
    useAdminBulkDeleteUsersMutation
} from "../../features/api/bloodApi";
import ViewUserModal from "../common/Modals/ViewUserModal";
import EditUserModal from "../common/Modals/EditUserModal";
import BulkDeleteModal from "../common/Modals/BulkDeleteModal";
import Pagination from "../common/Tables/Pagination";
import UserFilters from "../common/Filters/UserFilters";
import AddNewUserModal from "./AddNewUserModal";

export default function UsersTab({ users, onRefresh, onStatsRefresh }) {
    const { user: currentUser } = useSelector((state) => state.auth);
    const [userTypeFilter, setUserTypeFilter] = useState('all');
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [userStatusFilter, setUserStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userCurrentPage, setUserCurrentPage] = useState(1);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [showUserFilters, setShowUserFilters] = useState(false);

    const usersPerPage = 10;

    const [updateUserStatus, { isLoading: isUpdating }] = useAdminUpdateUserStatusMutation();
    const [deleteUser, { isLoading: isDeleting }] = useAdminDeleteUserMutation();
    const [bulkDeleteUsers] = useAdminBulkDeleteUsersMutation();

    const getStatusStyle = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-300';
            case 'blocked': return 'bg-red-100 text-red-700 border-red-300';
            case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const getUserRoleIcon = (role) => {
        switch (role) {
            case 'donor': return <FaHeartbeat className="text-red-600" />;
            case 'patient': return <FaUserMd className="text-blue-600" />;
            case 'admin': return <FaUserShield className="text-purple-600" />;
            default: return <FaUserCircle className="text-gray-600" />;
        }
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            user.phone?.includes(userSearchTerm) ||
            user.bloodGroup?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            user.city?.toLowerCase().includes(userSearchTerm.toLowerCase());

        // Handle role filter for both string and array
        const matchesType = userTypeFilter === 'all' || 
            (Array.isArray(user.role) ? user.role.includes(userTypeFilter) : user.role === userTypeFilter);
        
        const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage);
    const userStartIndex = (userCurrentPage - 1) * usersPerPage;
    const paginatedUsers = filteredUsers.slice(userStartIndex, userStartIndex + usersPerPage);

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleSaveEdit = async (formData) => {
        try {
            await updateUserStatus({ id: selectedUser._id, ...formData }).unwrap();
            toast.success('User updated successfully');
            onRefresh();
            onStatsRefresh();
            setShowEditModal(false);
            setSelectedUser(null);
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update user');
        }
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteUser(selectedUser._id).unwrap();
            toast.success('User deleted successfully');
            onRefresh();
            onStatsRefresh();
            setShowDeleteModal(false);
            setSelectedUser(null);
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSelectAllUsers = () => {
        if (selectedUsers.length === paginatedUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(paginatedUsers.map(u => u._id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedUsers.length === 0) {
            toast.error('Please select users to delete');
            return;
        }
        setShowBulkDeleteModal(true);
    };

    const confirmBulkDelete = async () => {
        try {
            await bulkDeleteUsers(selectedUsers).unwrap();
            toast.success(`${selectedUsers.length} users deleted successfully`);
            setSelectedUsers([]);
            onRefresh();
            onStatsRefresh();
            setShowBulkDeleteModal(false);
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to delete');
        }
    };

    const handleAddUser = async (newUser) => {
        // For now, show success and refetch
        toast.success('User created successfully!');
        onRefresh();
        onStatsRefresh();
        setShowAddUserModal(false);
    };

    return (
        <div className="space-y-4">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Users Management</h2>

                <div className="flex items-center gap-2">
                    {selectedUsers.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-red-700"
                        >
                            <FaTrashAlt className="text-xs" />
                            Delete ({selectedUsers.length})
                        </button>
                    )}
                    <button
                        onClick={() => setShowUserFilters(!showUserFilters)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <FaFilter className="text-xs" />
                        Filters
                    </button>
                    <button
                        onClick={() => setShowAddUserModal(true)}
                        className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:from-green-600 hover:to-green-700"
                    >
                        <FaUserPlus className="text-xs" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Filters */}
            <UserFilters
                show={showUserFilters}
                searchTerm={userSearchTerm}
                onSearchChange={setUserSearchTerm}
                typeFilter={userTypeFilter}
                onTypeChange={setUserTypeFilter}
                statusFilter={userStatusFilter}
                onStatusChange={setUserStatusFilter}
            />

            {/* Select All Checkbox */}
            {paginatedUsers.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                        type="checkbox"
                        checked={selectedUsers.length === paginatedUsers.length}
                        onChange={handleSelectAllUsers}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        {selectedUsers.length > 0 ? `${selectedUsers.length} selected` : 'Select All'}
                    </span>
                </div>
            )}

            {/* Users List */}
            {paginatedUsers.length === 0 ? (
                <div className="text-center py-12">
                    <FaUserCircle className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No users found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {paginatedUsers.map((user) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start gap-3">
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user._id)}
                                    onChange={() => handleSelectUser(user._id)}
                                    className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />

                                <div className="flex-1 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${user.role === 'donor' ? 'bg-red-100' :
                                                user.role === 'patient' ? 'bg-blue-100' : 'bg-purple-100'
                                                }`}>
                                                {getUserRoleIcon(user.role)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(user.status || 'active')}`}>
                                                        {user.status || 'active'}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                        {Array.isArray(user.role) ? user.role.join(', ') : user.role}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <FaEnvelope className="text-gray-400" />
                                                        <span className="text-gray-600">{user.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <FaPhone className="text-gray-400" />
                                                        <span className="text-gray-600">{user.phone || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <FaMapMarkerAlt className="text-gray-400" />
                                                        <span className="text-gray-600">{user.city || 'N/A'}</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                                                    {user.bloodGroup && (
                                                        <div className="bg-gray-50 p-2 rounded">
                                                            <p className="text-xs text-gray-500">Blood Group</p>
                                                            <p className="font-bold text-red-600">{user.bloodGroup}</p>
                                                        </div>
                                                    )}
                                                    {user.age && (
                                                        <div className="bg-gray-50 p-2 rounded">
                                                            <p className="text-xs text-gray-500">Age</p>
                                                            <p className="font-bold">{user.age}</p>
                                                        </div>
                                                    )}
                                                    {user.gender && (
                                                        <div className="bg-gray-50 p-2 rounded">
                                                            <p className="text-xs text-gray-500">Gender</p>
                                                            <p className="font-medium">{user.gender}</p>
                                                        </div>
                                                    )}
                                                    <div className="bg-gray-50 p-2 rounded">
                                                        <p className="text-xs text-gray-500">Joined</p>
                                                        <p className="text-sm font-medium">
                                                            {new Date(user.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {user.role === 'donor' && user.lastDonation && (
                                                    <div className="mt-2 p-2 bg-green-50 rounded-lg flex items-center gap-2">
                                                        <FaCalendarCheck className="text-green-600 text-xs" />
                                                        <p className="text-xs text-green-700">
                                                            Last Donation: {new Date(user.lastDonation).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex lg:flex-col gap-2">
                                        <button
                                            onClick={() => handleViewUser(user)}
                                            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center gap-2 justify-center transition-colors"
                                        >
                                            <FaEye /> View
                                        </button>
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 justify-center transition-colors"
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(user)}
                                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center gap-2 justify-center transition-colors"
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
            {totalUserPages > 1 && (
                <Pagination
                    currentPage={userCurrentPage}
                    totalPages={totalUserPages}
                    onPageChange={setUserCurrentPage}
                />
            )}

            {/* Modals */}
            <ViewUserModal
                isOpen={showViewModal}
                onClose={() => {
                    setShowViewModal(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
            />

            <EditUserModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                }}
                onSave={handleSaveEdit}
                user={selectedUser}
                isLoading={isUpdating}
            />

            <BulkDeleteModal
                isOpen={showBulkDeleteModal}
                onClose={() => {
                    setShowBulkDeleteModal(false);
                }}
                onConfirm={confirmBulkDelete}
                count={selectedUsers.length}
                type="users"
            />

            <AddNewUserModal
                isOpen={showAddUserModal}
                onClose={() => setShowAddUserModal(false)}
                onAddUser={handleAddUser}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTrashAlt className="text-3xl text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete User</h3>
                            <p className="text-gray-600 mb-2">
                                Are you sure you want to delete <span className="font-semibold text-gray-900">{selectedUser.name}</span>?
                            </p>
                            <p className="text-sm text-red-600 mb-6">
                                This action cannot be undone. All user data will be permanently removed.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedUser(null);
                                    }}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 font-semibold transition shadow-md disabled:opacity-50"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete User'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}