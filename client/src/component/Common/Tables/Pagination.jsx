import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                    <FaChevronLeft />
                </button>
                <button
                    onClick={() => onPageChange(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
}