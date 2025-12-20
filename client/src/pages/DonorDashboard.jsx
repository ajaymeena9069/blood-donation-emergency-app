/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaTint,
  FaBell,
  FaHandHoldingHeart,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  useGetDonorMatchesQuery,
  useGetDonorNotificationsQuery,
  useUpdateAvailabilityMutation,
} from "../features/api/bloodApi";

export default function DonorDashboard() {
  const { user } = useSelector((state) => state.auth);

  // Initialize states
  const [availability, setAvailability] = useState(false);
  const [nextEligibleDate, setNextEligibleDate] = useState(null);
  const [isEligible, setIsEligible] = useState(true); // Start as eligible
  const [lastDonationDate, setLastDonationDate] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);

  // For demo purposes - COOLDOWN PERIOD (2 DAYS)
  const COOLDOWN_DAYS = 2;

  // API HOOKS
  const { data: matchesData, isLoading: matchesLoading, refetch: refetchMatches } =
    useGetDonorMatchesQuery();
  const { data: notificationsData, isLoading: notifLoading, refetch: refetchNotifications } =
    useGetDonorNotificationsQuery(user?.id, { skip: !user?.id });
  const [updateAvailability] = useUpdateAvailabilityMutation();

  const matches = matchesData?.data || [];
  const notifications = notificationsData?.data || [];

  const totalMatches = matches.length;
  const completedDonations = matches.filter((req) => req.status === "completed")
    .length;
  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;
  const recentMatches = matches.slice(0, 2);

  // Find last donation date from completed donations
  const findLastDonationDate = () => {
    const completedDonations = matches
      .filter(req => req.status === "completed")
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    if (completedDonations.length > 0) {
      return new Date(completedDonations[0].updatedAt);
    }
    return null;
  };

  // ---------------------------
  // Check eligibility and set initial availability (DEMO VERSION - 2 DAYS)
  // ---------------------------
  useEffect(() => {
    if (user) {
      // For demo: Check localStorage for last availability toggle
      const lastToggle = localStorage.getItem(`lastToggle_${user.id}`);
      const lastAvailabilityChange = localStorage.getItem(`lastAvailabilityChange_${user.id}`);

      // Get last donation date
      const lastDonation = findLastDonationDate();
      setLastDonationDate(lastDonation);

      if (lastToggle) {
        const lastToggleDate = new Date(lastToggle);
        const today = new Date();
        const timeDiff = today - lastToggleDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        // Calculate next eligible date (2 days from last toggle)
        const nextDate = new Date(lastToggleDate);
        nextDate.setDate(nextDate.getDate() + COOLDOWN_DAYS);
        setNextEligibleDate(nextDate);

        // Check eligibility
        const eligible = daysDiff >= COOLDOWN_DAYS;
        setIsEligible(eligible);

        // Calculate days remaining
        const daysRemainingCalc = COOLDOWN_DAYS - daysDiff;
        setDaysRemaining(daysRemainingCalc > 0 ? daysRemainingCalc : 0);

        // Set availability
        if (!eligible) {
          setAvailability(false); // Force unavailable during cooldown
        } else {
          // Get saved availability status or use user preference
          const savedStatus = lastAvailabilityChange === "true";
          setAvailability(savedStatus || (user?.available ?? false));
        }
      } else {
        // First time - eligible by default
        setIsEligible(true);
        setAvailability(user?.available ?? false);
        // Set next eligible date to today + 2 days (for demo purposes)
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + COOLDOWN_DAYS);
        setNextEligibleDate(nextDate);
        setDaysRemaining(COOLDOWN_DAYS);
      }
    }
  }, [user, matches]);

  // ---------------------------
  // STATUS COLORS MAP
  // ---------------------------
  const statusColors = {
    pending: {
      card: "border-yellow-500 bg-yellow-50",
      badge: "bg-yellow-100 text-yellow-700",
    },
    accepted: {
      card: "border-blue-500 bg-blue-50",
      badge: "bg-blue-100 text-blue-700",
    },
    completed: {
      card: "border-green-500 bg-green-50",
      badge: "bg-green-100 text-green-700",
    },
    cancel: {
      card: "border-red-500 bg-red-50",
      badge: "bg-red-100 text-red-700",
    },
    rejected: {
      card: "border-red-500 bg-red-50",
      badge: "bg-red-100 text-red-700",
    },
  };

  // ---------------------------
  // Handle Availability Toggle (DEMO VERSION)
  // ---------------------------
  const handleToggleAvailability = async () => {
    try {
      // For demo: Check if user can toggle (2 days cooldown)
      if (!isEligible) {
        alert(`⏳ Demo Mode: You need to wait ${daysRemaining} more day(s) before changing availability.\n\nNext eligible: ${formatDate(nextEligibleDate)}`);
        return;
      }

      const newStatus = !availability;

      // Update local state
      setAvailability(newStatus);

      // Save current time as last toggle (for 2-day cooldown)
      localStorage.setItem(`lastToggle_${user.id}`, new Date().toISOString());
      localStorage.setItem(`lastAvailabilityChange_${user.id}`, newStatus.toString());

      // Update next eligible date (2 days from now)
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + COOLDOWN_DAYS);
      setNextEligibleDate(nextDate);
      setIsEligible(false);
      setDaysRemaining(COOLDOWN_DAYS);

      // Update in backend (for demo, still call API but with demo logic)
      await updateAvailability({
        id: user?.id,
        available: newStatus,
      }).unwrap();

      // Refetch data
      refetchMatches();
      refetchNotifications();

      alert(`✅ Demo Mode: Status updated to "${newStatus ? 'Available' : 'Not Available'}"\n\nYou can change again after ${COOLDOWN_DAYS} days.`);

    } catch (err) {
      console.error("Availability update error", err);
      alert("Failed to update availability");
      // Revert on error
      setAvailability(!availability);
    }
  };

  // ---------------------------
  // Format date for display
  // ---------------------------
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ---------------------------
  // Reset Demo Data (for presentation purposes)
  // ---------------------------
  const resetDemoData = () => {
    if (window.confirm("Reset demo data? This will clear the 2-day cooldown period.")) {
      localStorage.removeItem(`lastToggle_${user.id}`);
      localStorage.removeItem(`lastAvailabilityChange_${user.id}`);
      setIsEligible(true);
      setAvailability(user?.available ?? false);
      alert("✅ Demo data reset! You can now toggle availability.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 animate-fadeIn">
      {/* DEMO BANNER */}
      <div className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaClock className="text-purple-600 text-xl" />
            <div>
              <h3 className="font-bold text-purple-800">DEMO MODE - 2 Days Cooldown</h3>
              <p className="text-sm text-purple-600">
                For presentation purposes, cooldown period is set to 2 days (instead of 90 days)
              </p>
            </div>
          </div>
          <button
            onClick={resetDemoData}
            className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition"
          >
            Reset Demo
          </button>
        </div>
      </div>

      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Donor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name || "Donor"}!</p>
        </div>
        <FaUserCircle className="text-5xl text-gray-700" />
      </motion.div>

      {/* Eligibility & Availability Section */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Donation Status</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Eligibility Card */}
          <div className={`border rounded-xl p-4 ${isEligible ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
            <div className="flex items-center gap-3 mb-2">
              <FaCalendarAlt className={`text-xl ${isEligible ? 'text-green-600' : 'text-yellow-600'}`} />
              <h3 className="font-semibold">Eligibility Status</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Demo: {COOLDOWN_DAYS} days</span>
            </div>

            {isEligible ? (
              <div className="space-y-2">
                <p className="text-green-700 font-medium">✅ Eligible to Donate</p>
                <p className="text-sm text-green-600">
                  You can donate blood now
                </p>
                <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                  <p>🔄 <span className="font-semibold">Demo Note:</span> After toggling availability, you'll need to wait {COOLDOWN_DAYS} days to toggle again.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-yellow-700 font-medium">⏳ In Cooldown Period</p>
                <p className="text-sm text-yellow-600">
                  Next eligible: <span className="font-bold">{formatDate(nextEligibleDate)}</span>
                </p>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <p className="text-yellow-800 font-semibold">⏰ {daysRemaining} day(s) remaining</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Cooldown period: {COOLDOWN_DAYS} days (Demo Mode)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Availability Card */}
          <div className={`border rounded-xl p-4 ${availability ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center gap-3 mb-2">
              <FaTint className={`text-xl ${availability ? 'text-green-600' : 'text-red-600'}`} />
              <h3 className="font-semibold">Availability Status</h3>
            </div>

            <div className="space-y-4">
              <div className={`p-3 rounded-lg ${availability ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`font-bold text-lg text-center ${availability ? 'text-green-700' : 'text-red-700'}`}>
                  {availability ? '🏥 Available for Donation' : '🚫 Not Available'}
                </p>
              </div>

              {!isEligible && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-700">
                    ⚠️ You cannot change status during cooldown period
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Wait for {daysRemaining} more day(s)
                  </p>
                </div>
              )}

              <button
                onClick={handleToggleAvailability}
                disabled={!isEligible}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-[1.02] ${isEligible
                    ? availability
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow'
                  }`}
              >
                {!isEligible
                  ? `⏳ Wait ${daysRemaining} Day(s)`
                  : availability
                    ? '🚫 Mark as Unavailable'
                    : '✅ Mark as Available'}
              </button>

              {isEligible && (
                <p className="text-xs text-center text-gray-500">
                  Click to toggle availability ({COOLDOWN_DAYS}-day cooldown applies)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">📋 Demo Instructions:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Click toggle button to change availability status</li>
            <li>• After toggling, you'll enter a {COOLDOWN_DAYS}-day cooldown period</li>
            <li>• During cooldown, you cannot toggle again</li>
            <li>• Use "Reset Demo" button to clear cooldown during presentation</li>
            <li>• In real scenario, this would be 90 days for safety</li>
          </ul>
        </div>
      </motion.div>

      {/* STAT CARDS */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <NavLink to="/donor/matching-requests">
          <div className="rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 p-6 cursor-pointer flex items-center gap-5">
            <FaTint className="text-4xl text-red-500" />
            <div>
              <p className="text-gray-500 text-sm">Matching Requests</p>
              <p className="text-2xl font-bold">{matchesLoading ? "..." : totalMatches}</p>
            </div>
          </div>
        </NavLink>

        <NavLink to="/donor/history">
          <div className="rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 p-6 cursor-pointer flex items-center gap-5">
            <FaHandHoldingHeart className="text-4xl text-green-500" />
            <div>
              <p className="text-gray-500 text-sm">Completed Donations</p>
              <p className="text-2xl font-bold">{matchesLoading ? "..." : completedDonations}</p>
            </div>
          </div>
        </NavLink>

        <NavLink to="/donor/notifications">
          <div className="rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 p-6 cursor-pointer flex items-center gap-5">
            <FaBell className="text-4xl text-yellow-500" />
            <div>
              <p className="text-gray-500 text-sm">Unread Notifications</p>
              <p className="text-2xl font-bold">{notifLoading ? "..." : unreadNotificationCount}</p>
            </div>
          </div>
        </NavLink>
      </motion.div>

      {/* RECENT MATCH REQUESTS */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recent Matched Requests</h2>
          <NavLink to="/donor/matching-requests">
            <p className="text-red-600 hover:text-red-700 text-sm font-semibold">View All</p>
          </NavLink>
        </div>

        {matchesLoading ? (
          <div className="text-center py-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
            <p className="text-gray-500 mt-2">Loading matches...</p>
          </div>
        ) : recentMatches.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No matched requests yet.</p>
        ) : (
          <div className="space-y-4">
            {recentMatches.map((req) => {
              const color = statusColors[req.status] || statusColors["pending"];
              return (
                <motion.div
                  key={req._id}
                  className={`border-l-8 p-4 rounded-xl flex justify-between items-center shadow-sm transition-all hover:shadow-md ${color.card}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      Patient: {req?.patientId?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">Blood Group: {req.bloodGroup}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(req.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded font-semibold capitalize ${color.badge}`}>
                    {req.status}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* NOTIFICATIONS PREVIEW */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">Recent Notifications</h2>
            {unreadNotificationCount > 0 && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                {unreadNotificationCount} new
              </span>
            )}
          </div>
          <NavLink to="/donor/notifications">
            <p className="text-red-600 hover:text-red-700 text-sm font-semibold">View All</p>
          </NavLink>
        </div>

        {notifLoading ? (
          <div className="text-center py-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
            <p className="text-gray-500 mt-2">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No notifications found.</p>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 3).map((n) => (
              <motion.div
                key={n._id}
                className={`p-4 rounded-xl shadow-sm border-l-4 transition-all hover:shadow-md ${n.isRead
                    ? "bg-gray-50 border-gray-300 border-l-gray-400"
                    : "bg-red-50 border-red-100 border-l-red-500"
                  }`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 5 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`font-semibold ${n.isRead ? "text-gray-700" : "text-gray-900"}`}>
                      {n.title}
                      {!n.isRead && <span className="ml-2 text-xs text-red-600">● NEW</span>}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}