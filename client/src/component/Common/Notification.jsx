import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaBell,
    FaCheck,
    FaTrash,
    FaArrowLeft,
    FaFilter,
    FaSync,
    FaCheckDouble,
    FaCalendarAlt,
    FaHeartbeat,
    FaTint,
    FaHospital,
    FaUser,
    FaEnvelope,
    FaSpinner
} from "react-icons/fa";
import {
    useDeleteNotificationMutation,
    useMarkNotificationAsReadMutation,
    useGetMyNotificationsQuery,
    useGetUnreadNotificationCountQuery,
    useMarkAllNotificationsAsReadMutation
} from "../../features/api/bloodApi";

const NotificationsPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const currentRole = user?.activeRole || user.role[0];

    // State
    const [filter, setFilter] = useState("all");

    // API Queries
    const {
        data: notificationsData,
        isLoading,
        refetch
    } = useGetMyNotificationsQuery(currentRole, {
        refetchOnMountOrArgChange: true
    });

    const { data: unreadData } = useGetUnreadNotificationCountQuery(currentRole);

    // Mutations
    const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const [markAsRead] = useMarkNotificationAsReadMutation();

    // Extract data
    const notifications = notificationsData?.data || [];
    const unreadCount = unreadData?.count || 0;

    // Filter notifications
    const filteredNotifications = notifications
        .filter(notification => {
            if (filter === "read") return notification.isRead;
            if (filter === "unread") return !notification.isRead;
            return true;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Handler functions
    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;

        try {
            await markAllAsRead(currentRole).unwrap();
            refetch();
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead({ notificationId: id }).unwrap();
            refetch();
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this notification?")) {
            try {
                await deleteNotification({ notificationId: id }).unwrap();
                refetch();
            } catch (error) {
                console.error("Failed to delete:", error);
            }
        }
    };

    // Format date
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return "";
        }
    };

    const formatTimeAgo = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffMins < 1) return "Just now";
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return formatDate(dateString);
        } catch (error) {
            return "Recently";
        }
    };

    // Get notification type text
    const getNotificationTypeText = (type) => {
        switch (type) {
            case 'REQUEST_CREATED': return 'New Request';
            case 'REQUEST_ACCEPTED': return 'Request Accepted';
            case 'REQUEST_CANCELLED': return 'Request Cancelled';
            default: return type?.replace('_', ' ') || 'Notification';
        }
    };

    // Get notification type color
    const getNotificationTypeColor = (type) => {
        switch (type) {
            case 'REQUEST_CREATED': return 'text-blue-800 bg-blue-100 border-blue-300';
            case 'REQUEST_ACCEPTED': return 'text-green-800 bg-green-100 border-green-300';
            case 'REQUEST_CANCELLED': return 'text-red-800 bg-red-100 border-red-300';
            default: return 'text-gray-800 bg-gray-100 border-gray-300';
        }
    };

    // Get notification icon
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'REQUEST_CREATED': return <FaHeartbeat />;
            case 'REQUEST_ACCEPTED': return <FaCheck />;
            case 'REQUEST_CANCELLED': return <FaTrash />;
            default: return <FaBell />;
        }
    };

    // Tabs for filtering
    const tabs = [
        { id: "all", label: "All", count: notifications.length },
        { id: "unread", label: "Unread", count: unreadCount },
        { id: "read", label: "Read", count: notifications.length - unreadCount }
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <FaArrowLeft className="text-gray-600 text-lg" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FaBell className="text-xl text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                                <p className="text-gray-600 text-sm">
                                    {currentRole === 'donor' ? 'Donor' : 'Patient'} Dashboard
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => refetch()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            title="Refresh"
                        >
                            <FaSync className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${filter === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs ${filter === tab.id
                                ? 'bg-blue-500'
                                : 'bg-gray-200 text-gray-700'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition ml-auto"
                        >
                            <FaCheckDouble />
                            Mark All Read
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            {isLoading ? (
                <LoadingScreen />
            ) : filteredNotifications.length === 0 ? (
                <EmptyState filter={filter} />
            ) : (
                <div className="space-y-4">
                    {filteredNotifications.map((notification, idx) => {
                        const isUnread = !notification.isRead;
                        const typeColor = getNotificationTypeColor(notification.type);
                        const typeText = getNotificationTypeText(notification.type);

                        return (
                            <motion.div
                                key={notification._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${isUnread ? 'border-l-4 border-l-blue-500' : ''
                                    }`}
                            >
                                <div className="p-5">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeColor}`}>
                                                {typeText}
                                            </span>
                                            {isUnread && (
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {formatTimeAgo(notification.createdAt)}
                                        </span>
                                    </div>

                                    {/* Message */}
                                    <div className="mb-4">
                                        <p className="text-gray-700">
                                            {notification.message || `You have a new ${notification.type?.toLowerCase().replace('_', ' ')} notification`}
                                        </p>
                                    </div>

                                    {/* Request Details if available */}
                                    {notification.requestId && (
                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                {notification.requestId.bloodGroup && (
                                                    <div className="flex items-center gap-2">
                                                        <FaTint className="text-red-500 text-sm" />
                                                        <div>
                                                            <p className="text-xs text-gray-600">Blood Group</p>
                                                            <p className="font-medium text-gray-800">{notification.requestId.bloodGroup}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {notification.requestId.hospitalName && (
                                                    <div className="flex items-center gap-2">
                                                        <FaHospital className="text-gray-500 text-sm" />
                                                        <div>
                                                            <p className="text-xs text-gray-600">Hospital</p>
                                                            <p className="font-medium text-gray-800">{notification.requestId.hospitalName}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer with actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <FaCalendarAlt />
                                            {formatDate(notification.createdAt)}
                                        </div>

                                        <div className="flex gap-2">
                                            {isUnread && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification._id)}
                                                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm disabled:opacity-50"
                                                >
                                                    <FaCheck />
                                                    Mark Read
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(notification._id)}
                                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm disabled:opacity-50"
                                            >
                                                <FaTrash />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Footer */}
            {!isLoading && filteredNotifications.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-600">
                            Showing {filteredNotifications.length} of {notifications.length} notifications
                        </div>

                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${unreadCount === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                        >
                            <FaCheckDouble />
                            Mark All as Read
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Loading Screen
const LoadingScreen = () => (
    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <div className="inline-block h-10 w-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading notifications...</h3>
        <p className="text-gray-600">Please wait while we fetch your notifications</p>
    </div>
);

// Empty State
const EmptyState = ({ filter }) => (
    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <div className="text-gray-300 mb-4">
            <FaEnvelope className="text-5xl mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {filter === "all" ? "No notifications yet" : `No ${filter} notifications`}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
            {filter === "all"
                ? "You're all caught up! Check back later for updates."
                : `Try changing your filter to see more notifications.`
            }
        </p>
    </div>
);

export default NotificationsPage;