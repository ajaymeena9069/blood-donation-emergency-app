import React from "react";
import { NavLink } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function DonorQuickActions({ unreadCount }) {
    const actions = [
        { label: 'View All Matches', path: '/donor/matches' },
        { label: 'Donation History', path: '/donor/matches?status=completed' },
        { label: 'Notifications', path: '/notifications', badge: unreadCount },
        { label: 'Edit Profile', path: '/donor/profile' }
    ];

    return (
        <div className="bg-white rounded-xl border p-4">
            <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
                {actions.map((action, idx) => (
                    <NavLink key={idx} to={action.path}>
                        <div className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 text-sm">{action.label}</span>
                                {action.badge > 0 && (
                                    <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                                        {action.badge}
                                    </span>
                                )}
                            </div>
                            <FaArrowRight className="text-red-600 text-sm" />
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}