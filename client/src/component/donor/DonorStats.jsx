import React from "react";
import { FaUsers, FaCheckCircle, FaExclamationCircle, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StatCard from "../common/Cards/StatCard";

export default function DonorStats({ stats, matchesLoading }) {
    const navigate = useNavigate();

    const statCards = [
        {
            title: 'Total Matches',
            value: matchesLoading ? "..." : stats.totalMatches,
            subValue: `${stats.acceptedMatches} Accepted, ${stats.completedDonations} Completed`,
            icon: FaUsers,
            gradient: 'from-red-500 to-red-600',
            onClick: () => navigate("/donor/matches")
        },
        {
            title: 'Completed Donations',
            value: matchesLoading ? "..." : stats.completedDonations,
            subValue: 'Total Donations Made',
            icon: FaCheckCircle,
            gradient: 'from-green-500 to-green-600',
            onClick: () => navigate("/donor/matches?status=completed")
        },
        {
            title: 'Pending Matches',
            value: matchesLoading ? "..." : stats.pendingMatches,
            subValue: 'Awaiting Response',
            icon: FaExclamationCircle,
            gradient: 'from-yellow-500 to-yellow-600',
            onClick: () => navigate("/donor/matches?status=pending")
        },
        {
            title: 'Notifications',
            value: matchesLoading ? "..." : stats.unreadNotifications,
            subValue: 'Unread Messages',
            icon: FaBell,
            gradient: 'from-blue-500 to-blue-600',
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