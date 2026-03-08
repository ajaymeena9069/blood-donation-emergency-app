import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaTint, FaHeartbeat, FaHistory, FaSignOutAlt } from "react-icons/fa";

import {
    useGetDonorMatchesQuery,
    useGetMyNotificationsQuery,
    useActivateRoleMutation,
    useMarkNotificationAsReadMutation,
    useDeleteNotificationMutation,
    useResetDonationTimerMutation,
    useGetProfileQuery,
} from "../../features/api/bloodApi";
import { setCredentials, logoutUser } from "../../features/auth/authSlice";
import FlashMessage from "../../component/FlashMessage";
import LoadingSpinner from "../common/LoadingSpinner";
import WelcomeBanner from "../common/WelcomeBanner";
import NotificationComponent from "../../component/NotificationComponent";
import DashboardLayout from "../common/layout/DashboardLayout";
import ConfirmationModal from "../common/Modals/ConfirmationModal";
import RoleSwitcher from "./RoleSwitcher";
import DonorStats from "./DonorStats";
import DonorMatchesList from "./DonorMatchesList";
import DonorProfileCard from "./DonorProfileCard";
import DonorQuickActions from "./DonorQuickActions";

export default function DonorDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [flash, setFlash] = useState({ type: "", message: "" });
    const [isSwitchingRole, setIsSwitchingRole] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // API Hooks
    const {
        data: matchesData,
        isLoading: matchesLoading,
        refetch: refetchMatches
    } = useGetDonorMatchesQuery();

    const {
        data: notificationsData,
        refetch: refetchNotifications
    } = useGetMyNotificationsQuery("donor");

    const { data: profileData, refetch: refetchProfile } = useGetProfileQuery();

    // Mutations
    const [activateRole] = useActivateRoleMutation();
    const [markAsRead] = useMarkNotificationAsReadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const [resetTimer, { isLoading: isResetting }] = useResetDonationTimerMutation();

    // Update Redux store when profile data changes
    useEffect(() => {
        if (profileData?.data) {
            dispatch(setCredentials({
                token: localStorage.getItem('token'),
                user: profileData.data
            }));
        }
    }, [profileData, dispatch]);

    // Refetch profile on mount
    useEffect(() => {
        refetchProfile();
    }, []);

    const matches = matchesData?.data || [];
    const notifications = notificationsData?.data || [];

    // Stats
    const lastDonation = matches
        .filter((req) => req.status === "completed")
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] || null;

    const stats = {
        totalMatches: matches.length,
        completedDonations: matches.filter((req) => req.status === "completed").length,
        pendingMatches: matches.filter((req) => req.status === "pending").length,
        acceptedMatches: matches.filter((req) => req.status === "accepted").length,
        unreadNotifications: notifications.filter((n) => !n.isRead).length,
    };

    // Role Management
    const userRoles = user?.role || [];
    const currentRole = user?.activeRole || "donor";
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
            case 'canceled': return { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-800 border-red-300", icon: '✗', label: 'Canceled' };
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
                if (response.data?.token) {
                    localStorage.setItem('token', response.data.token);
                }

                dispatch(setCredentials({
                    token: response.data?.token || localStorage.getItem('token'),
                    user: response.data?.user || user
                }));

                setFlash({ type: "success", message: `✅ Switched to ${roleId}!` });

                setTimeout(() => {
                    navigate(`/${roleId}/dashboard`);
                }, 500);
            }
        } catch (error) {
            setFlash({
                type: "error",
                message: `❌ ${error?.data?.message || "Failed to switch role"}`
            });
        } finally {
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
        if (!dateString) return "Never";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Calculate next eligible date
    const getNextEligibleDate = () => {
        const currentUser = profileData?.data || user;
        if (!currentUser?.nextEligibleDate) return null;
        const nextDate = new Date(currentUser.nextEligibleDate);
        const today = new Date();

        if (nextDate <= today) return "Eligible Now";

        const diffTime = nextDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `In ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    };

    // Reset timer handler
    const handleResetTimer = async () => {
        if (!window.confirm("Reset donation timer? This will make you available immediately. (Development only)")) return;

        try {
            const response = await resetTimer().unwrap();
            setFlash({ type: "success", message: response.message || "Timer reset successfully!" });
            await refetchProfile();
            await refetchMatches();
        } catch (error) {
            setFlash({ type: "error", message: error?.data?.message || "Failed to reset timer" });
        }
    };

    const handleLogout = () => setShowLogoutModal(true);

    const confirmLogout = () => {
        setShowLogoutModal(false);
        dispatch(logoutUser());
        navigate('/login', { replace: true });
    };

    if (matchesLoading && matches.length === 0) {
        return <LoadingSpinner message="Loading Donor Dashboard..." />;
    }

    return (
        <>
            <FlashMessage flash={flash} setFlash={setFlash} />

            <DashboardLayout
                title="Donor Dashboard"
                subtitle="Blood Donation Management System"
                icon={FaTint}
                gradientFrom="from-red-600"
                gradientTo="to-red-700"
                notificationCount={stats.unreadNotifications}
                onRefresh={() => {
                    refetchMatches();
                    refetchProfile();
                }}
                onLogout={handleLogout}
                userRole="donor"
                onNotificationClick={() => navigate('/notifications')}
                mobileNavTabs={[
                    { id: "dashboard", label: "Dashboard", icon: FaTint, color: "red", link: "/donor/dashboard" },
                    { id: "matches", label: "Matches", icon: FaHeartbeat, color: "red", link: "/donor/matches" },
                    { id: "history", label: "History", icon: FaHistory, color: "red", link: "/donor/matches?status=completed" },
                    { id: "profile", label: "Profile", icon: FaSignOutAlt, color: "red", link: "/profile" }
                ]}
            >
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">

                <RoleSwitcher
                    userCurrentRoles={userCurrentRoles}
                    currentRole={currentRole}
                    onRoleSwitch={handleRoleSwitch}
                    gradientFrom="from-red-500"
                    gradientTo="to-red-600"
                />

                {/* Welcome Banner */}
                <WelcomeBanner
                    userName={user?.name || "Donor"}
                    message="Thank you for being a lifesaver! Check your matches and donation history."
                    icon={FaHeartbeat}
                    gradientFrom="from-red-500"
                    gradientTo="to-red-600"
                    iconColor="text-red-300"
                />

                {/* Quick actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <NavLink to="/donor/matches" className="flex-1">
                        <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-xl shadow-lg transition-all text-sm">
                            <FaHeartbeat />
                            <span className="font-semibold">View All Matches</span>
                        </button>
                    </NavLink>

                    <NavLink to="/donor/matches?status=completed" className="flex-1">
                        <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl shadow-lg transition-all text-sm">
                            <FaHistory />
                            <span className="font-semibold">Donation History</span>
                        </button>
                    </NavLink>
                </div>

                <DonorStats stats={stats} matchesLoading={matchesLoading} />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <DonorMatchesList
                            matches={matches}
                            loading={matchesLoading}
                            getStatusConfig={getStatusConfig}
                            formatDate={formatDate}
                        />
                    </div>

                    <div className="space-y-4">
                        <DonorProfileCard
                            user={profileData?.data || user}
                            lastDonation={lastDonation}
                            getNextEligibleDate={getNextEligibleDate}
                            formatDate={formatDate}
                            handleResetTimer={handleResetTimer}
                            isResetting={isResetting}
                        />

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

                        <DonorQuickActions unreadCount={stats.unreadNotifications} />
                    </div>
                </div>
                    </div>
                </div>

                <ConfirmationModal
                    isOpen={showLogoutModal}
                    onClose={() => setShowLogoutModal(false)}
                    onConfirm={confirmLogout}
                    title="Logout Confirmation"
                    message="Are you sure you want to logout from donor dashboard?"
                    confirmText="Logout"
                    icon={FaSignOutAlt}
                    iconBg="from-red-100 to-red-200"
                    iconColor="text-red-600"
                    confirmBg="from-red-600 to-red-700"
                    confirmHoverBg="from-red-700 to-red-800"
                />
            </DashboardLayout>
        </>
    );
}