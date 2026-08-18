import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./AbsenteeismTrendChart.css";

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
    <div className="chart-card">
      <h3 className="chart-card-title">Absenteeism Rate Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#4763e4"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}