import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./AbsenteeismTrendChart.css";

const mockData = [
  { month: "Jan", rate: 4.2, target: 5.0 },
  { month: "Feb", rate: 5.1, target: 5.0 },
  { month: "Mar", rate: 3.8, target: 5.0 },
  { month: "Apr", rate: 6.0, target: 5.0 },
  { month: "May", rate: 4.9, target: 5.0 },
  { month: "Jun", rate: 5.5, target: 5.0 },
  { month: "Jul", rate: 4.4, target: 5.0 },
];

const currentRate = mockData[mockData.length - 1].rate;
const previousRate = mockData[mockData.length - 2].rate;
const change = (((currentRate - previousRate) / previousRate) * 100).toFixed(1);
const isUp = change >= 0;

export default function AbsenteeismTrendChart() {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <span className="chart-card-title">Absenteeism Rate</span>
        <button className="chart-card-menu">⋯</button>
      </div>

      <div className="chart-card-value-row">
        <span className="chart-card-value">{currentRate}%</span>
        <span className={`chart-card-change ${isUp ? "up" : "down"}`}>
          {isUp ? "▲" : "▼"} {Math.abs(change)}% vs. last period
        </span>
      </div>

      <ResponsiveContainer width="100%" height={110}>
        <AreaChart data={mockData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4763e4" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#4763e4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#8b8fa3" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#8b8fa3" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #eef0f4",
              fontSize: 13,
            }}
            formatter={(value) => [`${value}%`, "Rate"]}
          />
          <Area
            type="monotone"
            dataKey="target"
            stroke="#d3d6e0"
            strokeDasharray="4 4"
            fill="none"
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="#4763e4"
            strokeWidth={2.5}
            fill="url(#rateGradient)"
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}