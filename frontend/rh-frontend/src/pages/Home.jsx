import { useEffect, useState } from "react";
import { Users, Calendar, FileText, TrendingUp, Sun, Moon } from "lucide-react";
import StatCard from "../components/StatCard";
import AbsenteeismTrendChart from "../components/AbsenteeismTrendChart";
import AbsenteeismRiskTable from "../components/AbsenteeismRiskTable";
import { getCurrentRole } from "../services/authService";
import { useTheme } from "../context/ThemeContext";
import "./Home.css";

const stats = [
  { label: "Total Employees", value: "142", change: "5.2%", trend: "up", icon: Users },
  { label: "On Leave Today", value: "8", change: "2.1%", trend: "down", icon: Calendar },
  { label: "Pending Contracts", value: "3", change: "1.0%", trend: "up", icon: FileText },
  { label: "High Risk Predictions", value: "5", change: "3.4%", trend: "up", icon: TrendingUp },
];

export default function Home() {
  const role = getCurrentRole();
  const { darkMode, setDarkMode } = useTheme();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title" style={{ marginBottom: 0 }}>
          Dashboard
        </h1>

        <div className="dashboard-datetime">
          <span>{dateStr} — {timeStr}</span>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {(role === "ADMIN" || role === "HR_MANAGER") && (
        <div className="dashboard-grid">
          <AbsenteeismTrendChart />
          <AbsenteeismRiskTable />
        </div>
      )}
    </div>
  );
}