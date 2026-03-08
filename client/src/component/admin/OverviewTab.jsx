import React from "react";
import {
    FaUsers, FaHeartbeat, FaTint, FaExclamationTriangle,
    FaClipboardList, FaUserPlus, FaChartBar, FaDownload,
    FaClock, FaBoxes, FaAward, FaGlobeAsia, FaHome,
    FaCheckCircle, FaAmbulance, FaHospital
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import toast from 'react-hot-toast';
import StatCard from "../common/Cards/StatCard";
import QuickActionCard from "../common/Cards/QuickActionCard";
import ActivityCard from "../common/Cards/ActivityCard";
import WelcomeBanner from "../common/WelcomeBanner";

export default function OverviewTab({
    stats,
    recentActivities,
    activitiesLoading,
    analyticsData,
    analyticsLoading,
    onQuickAction
}) {
    const { user } = useSelector((state) => state.auth);
    const quickActions = [
        { icon: FaClipboardList, label: 'New Request', color: 'blue', action: 'new-request' },
        { icon: FaUserPlus, label: 'Add User', color: 'green', action: 'add-user' },
        { icon: FaChartBar, label: 'View Reports', color: 'purple', action: 'view-reports' },
        { icon: FaDownload, label: 'Export Data', color: 'orange', action: 'export-data' }
    ];

    const statCards = [
        {
            title: 'Total Users',
            value: stats.users?.total || 0,
            subValue: `${stats.users?.donors || 0} Donors, ${stats.users?.patients || 0} Patients`,
            icon: FaUsers,
            gradient: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Blood Donors',
            value: stats.users?.donors || 0,
            subValue: `${stats.users?.availableDonors || 0} Available Now`,
            icon: FaHeartbeat,
            gradient: 'from-red-500 to-red-600'
        },
        {
            title: 'Total Requests',
            value: stats.requests?.total || 0,
            subValue: `${stats.requests?.pending || 0} Pending, ${stats.requests?.completed || 0} Completed`,
            icon: FaTint,
            gradient: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Emergency',
            value: stats.requests?.emergency || 0,
            subValue: 'Urgent Requests',
            icon: FaExclamationTriangle,
            gradient: 'from-orange-500 to-orange-600'
        }
    ];

    const quickStats = [
        { label: 'Today\'s Users', value: analyticsData?.data?.todayUsers || 0, icon: FaUserPlus, color: 'green' },
        { label: 'Today\'s Requests', value: analyticsData?.data?.todayRequests || 0, icon: FaClipboardList, color: 'blue' },
        { label: 'Success Rate', value: `${Math.round((stats.requests?.completed / stats.requests?.total) * 100) || 0}%`, icon: FaAward, color: 'yellow' },
        { label: 'Cities Active', value: stats.cityStats?.length || 0, icon: FaGlobeAsia, color: 'purple' }
    ];

    const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <WelcomeBanner
                userName={user?.name || "Admin"}
                message="Here's what's happening with your platform today."
                icon={FaHeartbeat}
                gradientFrom="from-red-600"
                gradientTo="to-red-700"
                iconColor="text-red-300"
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {statCards.map((stat, idx) => (
                    <StatCard key={idx} {...stat} delay={idx * 0.1} />
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, idx) => (
                    <QuickActionCard
                        key={idx}
                        icon={action.icon}
                        label={action.label}
                        color={action.color}
                        onClick={() => {
                            if (action.action === 'export-data') {
                                toast('🚀 Data export feature is under development! Soon you\'ll be able to export all data in multiple formats.', { duration: 4000, icon: 'ℹ️' });
                            } else {
                                onQuickAction(action.action);
                            }
                        }}
                    />
                ))}
            </div>

            {/* Activity Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaClock className="text-blue-600" />
                        Recent Activity
                    </h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {activitiesLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="text-2xl text-red-600 animate-spin">⟳</div>
                            </div>
                        ) : recentActivities.length === 0 ? (
                            <div className="text-center py-8">
                                <FaClock className="text-3xl text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500">No recent activities</p>
                            </div>
                        ) : (
                            recentActivities.slice(0, 5).map((activity) => (
                                <ActivityCard key={activity._id} activity={activity} />
                            ))
                        )}
                    </div>
                </div>

                {/* Blood Stock Overview */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaBoxes className="text-red-600" />
                        Blood Stock Overview
                    </h3>
                    <div className="space-y-3">
                        {analyticsLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="text-2xl text-red-600 animate-spin">⟳</div>
                            </div>
                        ) : (
                            bloodGroups.map((type) => {
                                const stock = analyticsData?.data?.bloodStock?.find(s => s._id === type);
                                const count = stock?.count || 0;
                                const maxCount = Math.max(...(analyticsData?.data?.bloodStock?.map(s => s.count) || [1]));
                                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                                return (
                                    <div key={type} className="flex items-center gap-3">
                                        <span className="w-12 text-sm font-medium text-gray-600">{type}</span>
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-red-600 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{count}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickStats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-${stat.color}-600 text-xs font-medium`}>{stat.label}</span>
                                <Icon className={`text-${stat.color}-500`} />
                            </div>
                            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}