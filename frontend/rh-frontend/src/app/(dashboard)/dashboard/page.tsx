
import { Users, Calendar, FileText, TrendingUp } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import AbsenteeismTrendChart from "@/components/dashboard/AbsenteeismTrendChart";
import AbsenteeismRiskTable from "@/components/dashboard/AbsenteeismRiskTable";

const stats = [
  { label: "Total Employees", value: "142", change: "5.2%", trend: "up" as const, icon: Users },
  { label: "On Leave Today", value: "8", change: "2.1%", trend: "down" as const, icon: Calendar },
  { label: "Pending Contracts", value: "3", change: "1.0%", trend: "up" as const, icon: FileText },
  { label: "High Risk Predictions", value: "5", change: "3.4%", trend: "up" as const, icon: TrendingUp },
];

export default function DashboardPage() {
  return (
    <div className="space-y-2">
      <h1 className="relative -top-1 text-1xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
  <AbsenteeismTrendChart />
  <AbsenteeismRiskTable />
</div>
    </div>
  );
}