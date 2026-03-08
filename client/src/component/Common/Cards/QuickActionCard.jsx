import React from "react";

export default function QuickActionCard({ icon: Icon, label, color, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`p-4 bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-xl border border-${color}-200 hover:shadow-md transition-all group`}
        >
            <Icon className={`text-${color}-600 text-xl mb-2 group-hover:scale-110 transition-transform`} />
            <p className={`text-sm font-medium text-${color}-700`}>{label}</p>
        </button>
    );
}