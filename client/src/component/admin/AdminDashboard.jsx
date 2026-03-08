import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    FaUsers, FaHeartbeat, FaExclamationTriangle, FaTint,
    FaUserShield, FaChartPie, FaClipboardList,
    FaSignOutAlt, FaHome, FaChartBar, FaHospital
} from "react-icons/fa";
import {
    useGetAdminDashboardStatsQuery,
    useAdminGetAllRequestsQuery,
    useGetAdminRecentActivitiesQuery,
    useAdminGetAllUsersQuery,
    useGetAdminAnalyticsQuery
} from "../../features/api/bloodApi";
import { logoutUser } from "../../features/auth/authSlice";
import DashboardLayout from "../common/layout/DashboardLayout";
import DashboardSidebar from "../common/layout/DashboardSidebar";
import OverviewTab from "./OverviewTab";
import RequestsTab from "./RequestsTab";
import UsersTab from "./UsersTab";
import AnalyticsTab from "./AnalyticsTab";
import ConfirmationModal from "../common/Modals/ConfirmationModal";
import AddNewUserModal from "./AddNewUserModal";
import FlashMessage from "../FlashMessage";
import LoadingSpinner from "../common/LoadingSpinner";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("overview");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [flash, setFlash] = useState({ type: "", message: "" });

    // API Hooks
    const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useGetAdminDashboardStatsQuery();
    const { data: requestsData, refetch: refetchRequests } = useAdminGetAllRequestsQuery({}, { skip: statsLoading });
    const { data: usersData, refetch: refetchUsers } = useAdminGetAllUsersQuery({}, { skip: statsLoading });
    const { data: activitiesData, isLoading: activitiesLoading } = useGetAdminRecentActivitiesQuery(20, { skip: statsLoading });
    const { data: analyticsData, isLoading: analyticsLoading } = useGetAdminAnalyticsQuery('week', { skip: statsLoading });

    const stats = statsData?.data || {};
    const allRequests = Array.isArray(requestsData) ? requestsData : [];
    const allUsers = Array.isArray(usersData) ? usersData : [];
    const recentActivities = Array.isArray(activitiesData?.data) ? activitiesData.data : [];

    const handleLogout = () => setShowLogoutModal(true);

    const confirmLogout = () => {
        setShowLogoutModal(false);
        setFlash({ type: "success", message: "Logged out successfully!" });
        setTimeout(() => {
            dispatch(logoutUser());
            navigate('/admin/login', { replace: true });
        }, 1000);
    };

    const handleRefresh = () => {
        refetchStats();
        refetchRequests();
        refetchUsers();
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: FaChartPie, mobileIcon: FaHome, color: "purple", gradientFrom: "from-purple-500", gradientTo: "to-purple-600" },
        { id: "requests", label: "Requests", icon: FaClipboardList, mobileIcon: FaTint, color: "blue", gradientFrom: "from-blue-500", gradientTo: "to-blue-600" },
        { id: "users", label: "Users", icon: FaUsers, mobileIcon: FaUserShield, color: "green", gradientFrom: "from-green-500", gradientTo: "to-green-600" },
        { id: "analytics", label: "Analytics", icon: FaChartBar, mobileIcon: FaHeartbeat, color: "red", gradientFrom: "from-red-500", gradientTo: "to-red-600" }
    ];

    if (statsLoading) {
        return <LoadingSpinner message="Loading Admin Dashboard..." />;
    }

    return (
        <>
            <FlashMessage flash={flash} setFlash={setFlash} />
            <DashboardLayout
            title="Admin Dashboard"
            subtitle="Manage and monitor blood donation platform"
            icon={FaUserShield}
            gradientFrom="from-red-600"
            gradientTo="to-red-800"
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onRefresh={handleRefresh}
            onLogout={handleLogout}
            notificationCount={0}
            userRole="admin"
        >
            <DashboardSidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === "overview" && (
                        <OverviewTab
                            stats={stats}
                            recentActivities={recentActivities}
                            activitiesLoading={activitiesLoading}
                            analyticsData={analyticsData}
                            analyticsLoading={analyticsLoading}
                            onQuickAction={(action) => {
                                if (action === 'new-request') setActiveTab('requests');
                                if (action === 'add-user') setShowAddUserModal(true);
                                if (action === 'view-reports') setActiveTab('analytics');
                            }}
                        />
                    )}

                    {activeTab === "requests" && (
                        <RequestsTab
                            requests={allRequests}
                            onRefresh={refetchRequests}
                            onStatsRefresh={refetchStats}
                            setFlash={setFlash}
                        />
                    )}

                    {activeTab === "users" && (
                        <UsersTab
                            users={allUsers}
                            onRefresh={refetchUsers}
                            onStatsRefresh={refetchStats}
                        />
                    )}

                    {activeTab === "analytics" && (
                        <AnalyticsTab
                            stats={stats}
                            analyticsData={analyticsData}
                            analyticsLoading={analyticsLoading}
                            bloodGroupData={stats.bloodGroupStats}
                            cityData={stats.cityStats}
                        />
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
                title="Logout Confirmation"
                message="Are you sure you want to logout from admin dashboard?"
                confirmText="Logout"
                icon={FaSignOutAlt}
                iconBg="from-red-100 to-red-200"
                iconColor="text-red-600"
                confirmBg="from-red-600 to-red-700"
                confirmHoverBg="from-red-700 to-red-800"
            />

            <AddNewUserModal
                isOpen={showAddUserModal}
                onClose={() => setShowAddUserModal(false)}
                onAddUser={() => {
                    setFlash({ type: "success", message: "User created successfully!" });
                    refetchUsers();
                    refetchStats();
                    setShowAddUserModal(false);
                }}
            />
        </DashboardLayout>
        </>
    );
}