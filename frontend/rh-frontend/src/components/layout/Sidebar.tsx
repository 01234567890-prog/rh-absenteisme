"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  Calendar,
  ClipboardCheck,
  Target,
  TrendingUp,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/users", icon: Users },
  { label: "Departments", href: "/departements", icon: Building2 },
  { label: "Positions", href: "/positions", icon: Briefcase },
  { label: "Contracts", href: "/contrats", icon: FileText },
  { label: "Leaves", href: "/leaves", icon: Calendar },
  { label: "Presence", href: "/presence", icon: ClipboardCheck },
  { label: "Evaluations", href: "/evaluations", icon: Target },
  { label: "Predictions", href: "/predictions", icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">RH System</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <Settings size={18} />
          Settings
        </Link>
      </div>
    </aside>
  );
}