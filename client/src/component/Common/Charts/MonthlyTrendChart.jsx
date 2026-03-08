import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MonthlyTrendChart({ data }) {
    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height={256}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill="#8B5CF6" />
                    <Bar dataKey="requests" fill="#EF4444" />
                    <Bar dataKey="donations" fill="#10B981" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}