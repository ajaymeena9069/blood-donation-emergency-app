import React from "react";
import { FaAmbulance, FaCheckCircle, FaClock } from "react-icons/fa";

export default function ActivityCard({ activity }) {
    const getActivityStyle = (type) => {
        switch (type) {
            case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
            case 'success': return 'text-green-700 bg-green-50 border-green-200';
            case 'emergency': return 'text-red-700 bg-red-50 border-red-200';
            case 'completed': return 'text-blue-700 bg-blue-50 border-blue-200';
            default: return 'text-gray-700 bg-gray-50 border-gray-200';
        }
    };

    const getActivityIcon = (type) => {
        if (type === 'emergency') return <FaAmbulance className="text-red-600" />;
        if (type === 'completed') return <FaCheckCircle className="text-green-600" />;
        return <FaClock className="text-yellow-600" />;
    };

    return (
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityStyle(activity.type)}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.type === 'emergency' ? 'bg-red-200' :
                    activity.type === 'completed' ? 'bg-green-200' : 'bg-yellow-200'
                }`}>
                {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
        </div>
    );
}