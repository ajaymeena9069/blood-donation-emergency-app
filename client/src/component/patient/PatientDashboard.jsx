import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHospital, FaSignOutAlt, FaTint, FaClipboardList, FaUser, FaBell } from "react-icons/fa";

import {
    useGetPatientRequestsQuery,
    useActivateRoleMutation,
    useGetMyNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useDeleteNotificationMutation,
    useGetProfileQuery
} from "../../features/api/bloodApi";
import { setCredentials, logoutUser } from "../../features/auth/authSlice";
import FlashMessage from "../../component/FlashMessage";
import LoadingSpinner from "../common/LoadingSpinner";
import WelcomeBanner from "../common/WelcomeBanner";
import NotificationComponent from "../../component/NotificationComponent";
import DashboardLayout from "../common/layout/DashboardLayout";
import ConfirmationModal from "../common/Modals/ConfirmationModal";
import RoleSwitcher from "../donor/RoleSwitcher"; // Same component, different colors
import PatientStats from "./PatientStats";
import PatientRequestsList from "./PatientRequestsList";
import PatientProfileCard from "./PatientProfileCard";
import PatientQuickActions from "./PatientQuickActions";
import CreateRequestButton from "./CreateRequestButton";

export default function PatientDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [flash, setFlash] = useState({ type: "", message: "" });
    const [isSwitchingRole, setIsSwitchingRole] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // API Hooks
    const {
        data: requestsData,
        isLoading: requestsLoading,
        refetch: refetchRequests
    } = useGetPatientRequestsQuery();

    const {
        data: notificationsData,
        refetch: refetchNotifications
    } = useGetMyNotificationsQuery("patient");

    const { data: profileData } = useGetProfileQuery();

    // Mutations
    const [activateRole] = useActivateRoleMutation();
    const [markAsRead] = useMarkNotificationAsReadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();

    // Update Redux store when profile data changes
    useEffect(() => {
        if (profileData?.data) {
            dispatch(setCredentials({
                token: localStorage.getItem('token'),
                user: profileData.data
            }));
        }
    }, [profileData, dispatch]);

    const requests = requestsData?.data || [];
    const notifications = notificationsData?.data || [];

    // Stats
    const stats = {
        totalRequests: requests.length,
        completedRequests: requests.filter(r => r.status === "completed").length,
        pendingRequests: requests.filter(r => r.status === "pending").length,
        acceptedRequests: requests.filter(r => r.status === "accepted").length,
        unreadNotifications: notifications.filter(n => !n.isRead).length,
    };

    // Role Management
    const userRoles = user?.role || [];
    const currentRole = user?.activeRole || "patient";
    const allRoles = [
        { id: "donor", name: "Blood Donor", icon: "🩸" },
        { id: "patient", name: "Blood Recipient", icon: "🏥" }
    ];
    const userCurrentRoles = allRoles.filter(role => userRoles.includes(role.id));

    // Status config
    const getStatusConfig = (status) => {
        switch (status) {
            case 'completed': return { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-800 border-green-300", icon: "✓", label: 'Completed' };
            case 'accepted': return { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-800 border-blue-300", icon: '✓', label: 'Accepted' };
            case 'pending': return { bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: '⏳', label: 'Pending' };
            case 'rejected': return { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-800 border-red-300", icon: '🚫', label: 'Rejected' };
            case 'canceled': return { bg: "bg-gray-50", border: "border-gray-200", badge: "bg-gray-100 text-gray-800 border-gray-300", icon: '✗', label: 'Canceled' };
            default: return { bg: "bg-gray-50", border: "border-gray-200", badge: "bg-gray-100 text-gray-800 border-gray-300", icon: '?', label: status };
        }
    };

    const handleRoleSwitch = async (roleId) => {
        if (isSwitchingRole || roleId === currentRole) return;

        setIsSwitchingRole(true);
        setFlash({ type: "info", message: `Switching to ${roleId} role...` });

        try {
            const response = await activateRole(roleId).unwrap();

            if (response.success) {
                const newToken = response.data?.token;
                const updatedUser = response.data?.user;

                // Update localStorage
                if (newToken) {
                    localStorage.setItem('token', newToken);
                }

                // Update Redux state
                dispatch(setCredentials({
                    token: newToken || localStorage.getItem('token'),
                    user: updatedUser
                }));

                setFlash({ type: "success", message: `✅ Switched to ${roleId}!` });

                // Navigate immediately with reload
                setTimeout(() => {
                    navigate(`/${roleId}/dashboard`, { replace: true });
                    window.location.reload(); // Force reload to ensure clean state
                }, 800);
            }
        } catch (error) {
            setFlash({
                type: "error",
                message: `❌ ${error?.data?.message || "Failed to switch role"}`
            });
            setIsSwitchingRole(false);
        }
    };

    // Notification handlers
    const handleRead = async (id) => {
        try {
            await markAsRead({ notificationId: id }).unwrap();
            refetchNotifications();
        } catch (err) {
            console.error("Mark as read failed:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this notification?")) {
            try {
                await deleteNotification({ notificationId: id }).unwrap();
                refetchNotifications();
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
        });
    };

    const handleLogout = () => setShowLogoutModal(true);

    const confirmLogout = () => {
        setShowLogoutModal(false);
        dispatch(logoutUser());
        navigate('/login', { replace: true });
    };

    if (requestsLoading && requests.length === 0) {
        return <LoadingSpinner message="Loading Patient Dashboard..." />;
    }

    return (
        <>
            <FlashMessage flash={flash} setFlash={setFlash} />

            <DashboardLayout
                title="Patient Dashboard"
                subtitle="Blood Donation Management System"
                icon={FaHospital}
                gradientFrom="from-blue-600"
                gradientTo="to-blue-700"
                notificationCount={stats.unreadNotifications}
                onRefresh={refetchRequests}
                onLogout={handleLogout}
                userRole="patient"
                onNotificationClick={() => navigate('/notifications')}
                mobileNavTabs={[
                    { id: "dashboard", label: "Dashboard", icon: FaHospital, color: "blue", link: "/patient/dashboard" },
                    { id: "requests", label: "Requests", icon: FaClipboardList, color: "blue", link: "/patient/requests/all" },
                    { id: "create", label: "Create", icon: FaTint, color: "blue", link: "/patient/create/request" },
                    { id: "profile", label: "Profile", icon: FaUser, color: "blue", link: "/profile" }
                ]}
            >
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">

                <RoleSwitcher
                    userCurrentRoles={userCurrentRoles}
                    currentRole={currentRole}
                    onRoleSwitch={handleRoleSwitch}
                    gradientFrom="from-blue-500"
                    gradientTo="to-blue-600"
                    isLoading={isSwitchingRole}
                />

                {/* Welcome Banner */}
                <WelcomeBanner
                    userName={user?.name || "Patient"}
                    message="Manage your blood requests and find matching donors quickly."
                    icon={FaHospital}
                    gradientFrom="from-blue-500"
                    gradientTo="to-blue-600"
                    iconColor="text-blue-300"
                />

                <CreateRequestButton />

                <PatientStats stats={stats} requestsLoading={requestsLoading} />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <PatientRequestsList
                            requests={requests}
                            loading={requestsLoading}
                            getStatusConfig={getStatusConfig}
                            formatDate={formatDate}
                        />
                    </div>

                    <div className="space-y-4">
                        <PatientProfileCard user={user} />

                        <NotificationComponent
                            notifications={notifications.slice(0, 3)}
                            stats={{ unreadNotifications: stats.unreadNotifications }}
                            onMarkAsRead={handleRead}
                            onDelete={handleDelete}
                            title="Recent Notifications"
                            maxItems={3}
                            compact={true}
                            showViewAll={true}
                        />

                        <PatientQuickActions unreadCount={stats.unreadNotifications} />
                    </div>
                </div>
                    </div>
                </div>

                <ConfirmationModal
                    isOpen={showLogoutModal}
                    onClose={() => setShowLogoutModal(false)}
                    onConfirm={confirmLogout}
                    title="Logout Confirmation"
                    message="Are you sure you want to logout from patient dashboard?"
                    confirmText="Logout"
                    icon={FaSignOutAlt}
                    iconBg="from-blue-100 to-blue-200"
                    iconColor="text-blue-600"
                    confirmBg="from-blue-600 to-blue-700"
                    confirmHoverBg="from-blue-700 to-blue-800"
                />
            </DashboardLayout>
        </>
    );
}