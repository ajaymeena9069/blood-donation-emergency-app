import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function WeeklyActivityChart({ data }) {
    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height={256}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="requests" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="donations" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="emergencies" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}