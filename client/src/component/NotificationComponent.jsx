import React from "react";
import {
    FaBell,
    FaEnvelope,
    FaCheck,
    FaTrash,
    FaArrowRight
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const NotificationComponent = ({
    notifications = [],
    stats = { unreadNotifications: 0 },
    onMarkAsRead,
    onDelete,
    title = "Recent Notifications",
    maxItems = 3,
    showViewAll = true,
    compact = false,
    showDelete = true,
    showMarkAsRead = true
}) => {
    
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            const formattedDate = date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short'
            });
            return formattedDate;
        }
    };

    const displayNotifications = notifications.slice(0, maxItems);

    if (compact) {
        return (
            <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <FaBell className="text-blue-600 text-sm" />
                        <h3 className="font-bold text-gray-900">{title}</h3>
                        {stats?.unreadNotifications > 0 && (
                            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                                {stats.unreadNotifications} new
                            </span>
                        )}
                    </div>
                    {showViewAll && (
                        <NavLink to="/notifications" className="text-blue-600 hover:text-blue-700 text-sm">
                            View All
                        </NavLink>
                    )}
                </div>

                {displayNotifications.length === 0 ? (
                    <div className="text-center py-4">
                        <FaEnvelope className="text-gray-300 text-2xl mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {displayNotifications.map(n => (
                            <div
                                key={n._id}
                                className={`p-2.5 rounded-lg border ${n.isRead ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-2">
                                            <div className={`mt-0.5 h-2 w-2 rounded-full ${n.isRead ? 'bg-gray-400' : 'bg-blue-500'}`}></div>
                                            <div className="flex-1">
                                                <p className={`font-medium text-xs ${n.isRead ? 'text-gray-800' : 'text-gray-900'}`}>
                                                    {n.title}
                                                </p>
                                                <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{n.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatTimeAgo(n.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 ml-1">
                                        {showMarkAsRead && !n.isRead && (
                                            <button
                                                onClick={() => onMarkAsRead?.(n._id)}
                                                className="p-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs"
                                                title="Mark as read"
                                            >
                                                <FaCheck size={10} />
                                            </button>
                                        )}
                                        {showDelete && (
                                            <button
                                                onClick={() => onDelete?.(n._id)}
                                                className="p-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs"
                                                title="Delete"
                                            >
                                                <FaTrash size={10} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Expanded version (for bottom section)
    return (
        <div className="bg-white rounded-xl border p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                    {stats?.unreadNotifications > 0 && (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                            {stats.unreadNotifications} new
                        </span>
                    )}
                </div>
                {showViewAll && (
                    <NavLink to="/notifications" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                        View All <FaArrowRight />
                    </NavLink>
                )}
            </div>

            {displayNotifications.length === 0 ? (
                <div className="text-center py-8">
                    <FaEnvelope className="text-gray-300 text-4xl mx-auto mb-3" />
                    <p className="text-gray-500">No notifications yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {displayNotifications.map(n => (
                        <div key={n._id} className={`p-3 rounded-lg border ${n.isRead ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className={`font-medium text-sm ${n.isRead ? 'text-gray-800' : 'text-gray-900'}`}>
                                            {n.title}
                                        </p>
                                        {!n.isRead && <span className="text-xs text-blue-600">● NEW</span>}
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2">{n.message}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {formatTimeAgo(n.createdAt)}
                                    </p>
                                </div>

                                <div className="flex gap-1 ml-2">
                                    {showMarkAsRead && !n.isRead && (
                                        <button
                                            onClick={() => onMarkAsRead?.(n._id)}
                                            className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded"
                                            title="Mark as read"
                                        >
                                            <FaCheck size={12} />
                                        </button>
                                    )}
                                    {showDelete && (
                                        <button
                                            onClick={() => onDelete?.(n._id)}
                                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded"
                                            title="Delete"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationComponent;