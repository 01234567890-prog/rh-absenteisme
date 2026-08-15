
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
}

export default function StatCard({ label, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{label}</span>
        <Icon size={18} className="text-gray-400" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <span
        className={`text-xs font-medium ${
          trend === "up" ? "text-green-600" : "text-red-600"
        }`}
      >
        {trend === "up" ? "▲" : "▼"} {change}
      </span>
    </div>
  );
}