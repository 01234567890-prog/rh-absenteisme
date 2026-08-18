import "./StatCard.css";

export default function StatCard({ label, value, change, trend, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        {Icon && <Icon size={18} color="#8b8fa3" />}
      </div>
      <div className="stat-card-value">{value}</div>
      <span className={`stat-card-change ${trend}`}>
        {trend === "up" ? "▲" : "▼"} {change}
      </span>
    </div>
  );
}