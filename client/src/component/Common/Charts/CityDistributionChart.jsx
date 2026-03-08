import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CityDistributionChart({ data }) {
    const chartData = data?.map(city => ({
        name: city._id,
        donors: city.donors || 0,
        patients: city.patients || 0
    })) || [];

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="donors" fill="#EF4444" />
                    <Bar dataKey="patients" fill="#3B82F6" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}