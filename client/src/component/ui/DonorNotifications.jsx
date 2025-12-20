/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaTrash, FaCheck, FaBell } from "react-icons/fa";

import {
    useGetDonorNotificationsQuery,
    useMarkAsReadMutation,
    useDeleteNotificationMutation,
} from "../../features/api/bloodApi";

export default function DonorNotifications() {
    const { user } = useSelector((s) => s.auth);
    const donorId = user?.id;

    const { data, isLoading } = useGetDonorNotificationsQuery(donorId, {
        skip: !donorId,
    });

    const [markAsRead] = useMarkAsReadMutation();
    const [deleteNotif] = useDeleteNotificationMutation();

    // backend returns { success, notifications: [...] }
    const notifications = data?.notifications || [];

    const handleMark = async (id) => {
        try {
            await markAsRead(id).unwrap();
        } catch (err) {
            console.error("Mark error", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotif(id).unwrap();
        } catch (err) {
            console.error("Delete error", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-6"
            >
                <FaBell className="text-3xl text-red-600" />
                <h1 className="text-2xl font-bold">Notifications</h1>
            </motion.div>

            {isLoading && (
                <div className="text-center text-gray-500">Loading...</div>
            )}

            <div className="space-y-4">
                {notifications.length === 0 && !isLoading && (
                    <div className="p-6 bg-white rounded-xl shadow text-center text-gray-500">
                        No notifications available.
                    </div>
                )}

                {notifications.map((n) => {
                    const isRead = n.read; // FIX: backend uses "read"

                    return (
                        <motion.div
                            key={n._id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`relative bg-white p-5 rounded-xl shadow transition-all 
                                ${isRead ? "border border-gray-200" : "border border-red-300 bg-red-50"}
                            `}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-semibold text-gray-800">
                                        {n.title}
                                    </div>

                                    <div className="text-sm text-gray-600 mt-1">
                                        {n.message}
                                    </div>

                                    <div className="text-xs text-gray-400 mt-2">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {!isRead && (
                                        <button
                                            onClick={() => handleMark(n._id)}
                                            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                                        >
                                            <FaCheck />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(n._id)}
                                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            {!isRead && (
                                <span className="absolute top-3 right-3 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs shadow">
                                    NEW
                                </span>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
