"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { month: "Jan", rate: 4.2 },
  { month: "Feb", rate: 5.1 },
  { month: "Mar", rate: 3.8 },
  { month: "Apr", rate: 6.0 },
  { month: "May", rate: 4.9 },
  { month: "Jun", rate: 5.5 },
];

export default function AbsenteeismTrendChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-500 mb-4">
        Absenteeism Rate Trend
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}