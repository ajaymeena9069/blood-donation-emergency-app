import React from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatusDistributionChart({ data }) {
    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height={256}>
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="80%"
                    data={data}
                    startAngle={90}
                    endAngle={-270}
                >
                    <RadialBar
                        minAngle={15}
                        background
                        clockWise={true}
                        dataKey="value"
                        label={{ fill: '#666', position: 'insideStart' }}
                    />
                    <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" align="right" />
                    <Tooltip />
                </RadialBarChart>
            </ResponsiveContainer>
        </div>
    );
}