import React from "react";
import { FaHeartbeat, FaCheckCircle, FaExclamationCircle, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StatCard from "../common/Cards/StatCard";

export default function PatientStats({ stats, requestsLoading }) {
    const navigate = useNavigate();

    const statCards = [
        {
            title: 'Total Requests',
            value: requestsLoading ? "..." : stats.totalRequests,
            subValue: `${stats.pendingRequests} Pending, ${stats.completedRequests} Completed`,
            icon: FaHeartbeat,
            gradient: 'from-blue-500 to-blue-600',
            onClick: () => navigate("/patient/requests/all")
        },
        {
            title: 'Completed',
            value: requestsLoading ? "..." : stats.completedRequests,
            subValue: 'Successfully Fulfilled',
            icon: FaCheckCircle,
            gradient: 'from-green-500 to-green-600',
            onClick: () => navigate("/patient/requests/completed")
        },
        {
            title: 'Pending Requests',
            value: requestsLoading ? "..." : stats.pendingRequests,
            subValue: 'Awaiting Donors',
            icon: FaExclamationCircle,
            gradient: 'from-yellow-500 to-yellow-600',
            onClick: () => navigate("/patient/requests/pending")
        },
        {
            title: 'Notifications',
            value: requestsLoading ? "..." : stats.unreadNotifications,
            subValue: 'Unread Messages',
            icon: FaBell,
            gradient: 'from-purple-500 to-purple-600',
            onClick: () => navigate("/notifications")
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statCards.map((stat, idx) => (
                <StatCard key={idx} {...stat} delay={idx * 0.1} />
            ))}
        </div>
    );
}