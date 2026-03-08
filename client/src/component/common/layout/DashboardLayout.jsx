import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import DashboardFooter from "./DashboardFooter";
import MobileNavigation from "./MobileNavigation";

export default function DashboardLayout({
    children,
    title,
    subtitle,
    icon: Icon,
    gradientFrom,
    gradientTo,
    tabs = [],
    activeTab,
    onTabChange,
    onRefresh,
    onLogout,
    stats,
    userRole = 'admin',
    notificationCount = 0,
    onNotificationClick,
    mobileNavTabs = []
}) {
    const navigate = useNavigate();

    // Hide main website navbar and footer on mount (not dashboard footer)
    useEffect(() => {
        const mainNavbar = document.querySelector('body > nav');
        const mainFooter = document.querySelector('body > footer');
        if (mainNavbar) mainNavbar.style.display = 'none';
        if (mainFooter) mainFooter.style.display = 'none';
        return () => {
            if (mainNavbar) mainNavbar.style.display = '';
            if (mainFooter) mainFooter.style.display = '';
        };
    }, []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            <DashboardHeader
                title={title}
                subtitle={subtitle}
                icon={Icon}
                gradientFrom={gradientFrom}
                gradientTo={gradientTo}
                notificationCount={notificationCount}
                onRefresh={onRefresh}
                onLogout={onLogout}
                onNotificationClick={onNotificationClick}
                userRole={userRole}
            />

            <main className="flex-1 min-h-0 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            <DashboardFooter />

            {/* Mobile Navigation - Fixed at bottom */}
            {mobileNavTabs.length > 0 ? (
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 shadow-lg">
                    <div className="grid grid-cols-4 gap-1 px-2 py-2">
                        {mobileNavTabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = window.location.pathname === tab.link;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => navigate(tab.link)}
                                    className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all active:scale-95 ${
                                        isActive ? `bg-${tab.color}-50` : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`relative transition-transform ${
                                        isActive ? 'scale-110' : 'hover:scale-105'
                                    }`}>
                                        <Icon className={`text-xl mb-1 transition-colors ${
                                            isActive ? `text-${tab.color}-600` : 'text-gray-500'
                                        }`} />
                                    </div>
                                    <span className={`text-xs font-medium transition-colors ${
                                        isActive ? `text-${tab.color}-600` : 'text-gray-600'
                                    }`}>
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <MobileNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    gradientFrom={gradientFrom}
                    gradientTo={gradientTo}
                />
            )}
        </div>
    );
}