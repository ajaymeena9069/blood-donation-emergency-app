import React from "react";
import { NavLink } from "react-router-dom";
import { FaArrowRight, FaPlusCircle, FaSearch, FaUserEdit, FaBell } from "react-icons/fa";

export default function PatientQuickActions({ unreadCount }) {
    const actions = [
        { label: 'New Blood Request', path: '/patient/create/request', icon: FaPlusCircle, color: 'blue' },
        { label: 'View All Requests', path: '/patient/requests/all', icon: FaSearch, color: 'gray' },
        { label: 'Find Donors', path: '/donors', icon: FaSearch, color: 'gray' },
        { label: 'Notifications', path: '/notifications', icon: FaBell, color: 'gray', badge: unreadCount },
        { label: 'Edit Profile', path: '/patient/profile', icon: FaUserEdit, color: 'gray' }
    ];

    return (
        <div className="bg-white rounded-xl border p-4">
            <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
                {actions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                        <NavLink key={idx} to={action.path}>
                            <div className={`p-2.5 ${action.color === 'blue' ? 'bg-blue-50 hover:bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg flex items-center justify-between`}>
                                <div className="flex items-center gap-2">
                                    <Icon className={action.color === 'blue' ? 'text-blue-600' : 'text-gray-600'} />
                                    <span className="font-medium text-gray-900 text-sm">{action.label}</span>
                                    {action.badge > 0 && (
                                        <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                                            {action.badge}
                                        </span>
                                    )}
                                </div>
                                <FaArrowRight className={action.color === 'blue' ? 'text-blue-600' : 'text-gray-600'} />
                            </div>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
}