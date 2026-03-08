import React from "react";
import { FaHeart } from "react-icons/fa";

export default function DashboardFooter() {
    return (
        <footer className="w-full bg-white border-t border-gray-200 py-2 mt-auto">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 text-xs md:text-sm text-gray-600">
                    <p className="flex items-center gap-1">
                        Made with <FaHeart className="text-red-500 text-xs" /> by Blood Donation Team
                    </p>
                    <span className="hidden md:inline">•</span>
                    <p>© 2024 All rights reserved</p>
                </div>
            </div>
        </footer>
    );
}