/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaBell, FaTrash, FaCheck, FaEnvelope, FaEnvelopeOpen, FaFilter } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useDeleteNotificationMutation,
    useMarkAllAsReadMutation,
} from "../../features/api/bloodApi";
import { useNavigate } from "react-router-dom";

export default function AllNotifications() {
    const { user } = useSelector((state) => state.auth);
    const [filter, setFilter] = useState("all"); 

    const { data, isLoading, refetch } = useGetNotificationsQuery(user?.id, {
        refetchOnMountOrArgChange: true,
    });

    const [markAsRead] = useMarkAsReadMutation();
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const navigate = useNavigate();

    const notifications = data?.notifications || [];

    // Filter notifications based on selection
    const filteredNotifications = notifications.filter(notification => {
        if (filter === "unread") return !notification.read;
        if (filter === "read") return notification.read;
        return true; // "all"
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this notification?")) {
            try {
                await deleteNotification(id).unwrap();
                refetch();
            } catch (err) {
                console.error("Delete error:", err);
            }
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id).unwrap();
            refetch();
        } catch (err) {
            console.error("Mark as read error:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;

        try {
            await markAllAsRead(user?.id).unwrap();
            refetch();
        } catch (err) {
            console.error("Mark all as read error:", err);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        }
    };

    const formatFullDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* HEADER */}
                <motion.div
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow hover:bg-gray-50"
                        >
                            <FaArrowLeft className="text-gray-600" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <FaBell className="text-3xl text-red-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                                <p className="text-gray-600 text-sm">
                                    {notifications.length} total • {unreadCount} unread
                                </p>
                            </div>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <FaCheck />
                            Mark All as Read
                        </button>
                    )}
                </motion.div>

                {/* FILTER BAR */}
                <motion.div
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-2 text-gray-600 mr-4">
                        <FaFilter className="text-sm" />
                        <span className="text-sm font-medium">Filter:</span>
                    </div>
                    {[
                        { key: "all", label: "All", count: notifications.length },
                        { key: "unread", label: "Unread", count: unreadCount },
                        { key: "read", label: "Read", count: notifications.length - unreadCount }
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setFilter(item.key)}
                            className={`px-4 py-2 rounded-lg transition-all font-medium ${filter === item.key
                                    ? "bg-red-600 text-white shadow-sm"
                                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                                }`}
                        >
                            {item.label}
                            {item.count > 0 && (
                                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${filter === item.key
                                        ? "bg-white/20"
                                        : "bg-gray-200 text-gray-700"
                                    }`}>
                                    {item.count}
                                </span>
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* NOTIFICATIONS LIST */}
                <AnimatePresence>
                    {isLoading ? (
                        <div className="text-center py-16">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
                            <p className="text-gray-500">Loading notifications...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl shadow-sm p-12 text-center"
                        >
                            <div className="text-gray-400 mb-4">
                                {filter === "all" ? (
                                    <FaBell className="text-6xl mx-auto" />
                                ) : filter === "unread" ? (
                                    <FaEnvelopeOpen className="text-6xl mx-auto" />
                                ) : (
                                    <FaEnvelope className="text-6xl mx-auto" />
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No notifications found
                            </h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                {filter === "unread"
                                    ? "You have no unread notifications."
                                    : filter === "read"
                                        ? "You have no read notifications."
                                        : "You don't have any notifications yet."
                                }
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-3">
                            {filteredNotifications.map((notification, index) => (
                                <motion.div
                                    key={notification._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${notification.read ? "border-gray-200" : "border-red-200"
                                        }`}
                                >
                                    <div className="p-4 md:p-5">
                                        <div className="flex gap-4">
                                            {/* ICON */}
                                            <div className={`p-3 rounded-xl ${notification.read
                                                    ? "bg-gray-100 text-gray-600"
                                                    : "bg-red-100 text-red-600"
                                                }`}>
                                                {notification.read ? (
                                                    <FaEnvelopeOpen className="text-lg" />
                                                ) : (
                                                    <FaEnvelope className="text-lg" />
                                                )}
                                            </div>

                                            {/* CONTENT */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                                    <h3 className={`font-semibold text-lg ${notification.read ? "text-gray-700" : "text-gray-900"
                                                        }`}>
                                                        {notification.title}
                                                        {!notification.read && (
                                                            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                                                        )}
                                                    </h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                                            {formatTime(notification.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 mb-3">
                                                    {notification.message}
                                                </p>

                                                <div className="flex items-center justify-between mt-4">
                                                    <span className="text-xs text-gray-500">
                                                        {formatFullDate(notification.createdAt)}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notification._id)}
                                                                className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                                            >
                                                                <FaCheck className="text-xs" />
                                                                Mark as Read
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(notification._id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete notification"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* STATUS INDICATOR */}
                                    {!notification.read && (
                                        <div className="h-1 bg-gradient-to-r from-red-500 to-red-400"></div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {/* FOOTER INFO */}
                {filteredNotifications.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center text-sm text-gray-500 pt-4"
                    >
                        <p>
                            Showing {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                            {filter !== 'all' && ` (filtered by ${filter})`}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}