import React, { useState } from "react";
import {
    FaUsers, FaHeartbeat, FaTint, FaAward,
    FaChartPie, FaChartLine, FaChartBar,
    FaMapMarkerAlt, FaDownload
} from "react-icons/fa";
import toast from 'react-hot-toast';
import BloodGroupChart from "../common/Charts/BloodGroupChart";
import UserRoleChart from "../common/Charts/UserRoleChart";
import WeeklyActivityChart from "../common/Charts/WeeklyActivityChart";
import MonthlyTrendChart from "../common/Charts/MonthlyTrendChart";
import CityDistributionChart from "../common/Charts/CityDistributionChart";
import StatusDistributionChart from "../common/Charts/StatusDistributionChart";

export default function AnalyticsTab({ stats, analyticsData, analyticsLoading, bloodGroupData, cityData }) {
    const [timeRange, setTimeRange] = useState('week');

    const summaryCards = [
        { label: 'Total Users', value: stats.users?.total || 0, change: '+12%', icon: FaUsers, color: 'purple' },
        { label: 'Total Donors', value: stats.users?.donors || 0, change: '+8%', icon: FaHeartbeat, color: 'red' },
        { label: 'Total Requests', value: stats.requests?.total || 0, change: '+15%', icon: FaTint, color: 'blue' },
        { label: 'Success Rate', value: `${Math.round((stats.requests?.completed / stats.requests?.total) * 100) || 0}%`, change: '+5%', icon: FaAward, color: 'green' }
    ];

    const statusDistribution = [
        { name: 'Pending', value: stats.requests?.pending || 0, color: '#FBBF24' },
        { name: 'Accepted', value: stats.requests?.accepted || 0, color: '#60A5FA' },
        { name: 'Completed', value: stats.requests?.completed || 0, color: '#34D399' }
    ];

    const userRoleData = [
        { name: 'Donors', value: stats.users?.donors || 0, color: '#EF4444' },
        { name: 'Patients', value: stats.users?.patients || 0, color: '#3B82F6' },
        { name: 'Admins', value: stats.users?.admins || 0, color: '#8B5CF6' }
    ];

    const weeklyActivityData = analyticsData?.data?.weeklyActivity || [];
    const monthlyTrendData = analyticsData?.data?.monthlyTrend || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h2>

                <div className="flex items-center gap-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="quarter">Last 3 Months</option>
                        <option value="year">Last Year</option>
                    </select>
                    <button
                        onClick={() => toast('📈 Analytics report export coming soon! PDF and Excel formats will be available.', { duration: 4000, icon: 'ℹ️' })}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <FaDownload className="text-xs" />
                        Report
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {summaryCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <Icon className={`text-${stat.color}-500 text-xl`} />
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Blood Group Distribution */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaChartPie className="text-red-600" />
                        Blood Group Distribution
                    </h3>
                    <BloodGroupChart data={bloodGroupData} />
                </div>

                {/* User Role Distribution */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaUsers className="text-blue-600" />
                        User Role Distribution
                    </h3>
                    <UserRoleChart data={userRoleData} />
                </div>

                {/* Weekly Activity */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaChartLine className="text-green-600" />
                        Weekly Activity
                    </h3>
                    <WeeklyActivityChart data={weeklyActivityData} />
                </div>

                {/* Monthly Trend */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaChartBar className="text-purple-600" />
                        Monthly Trend
                    </h3>
                    <MonthlyTrendChart data={monthlyTrendData} />
                </div>

                {/* City Distribution */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-orange-600" />
                        City-wise Distribution
                    </h3>
                    <CityDistributionChart data={cityData} />
                </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaChartPie className="text-indigo-600" />
                    Request Status Distribution
                </h3>
                <StatusDistributionChart data={statusDistribution} />
            </div>
        </div>
    );
}