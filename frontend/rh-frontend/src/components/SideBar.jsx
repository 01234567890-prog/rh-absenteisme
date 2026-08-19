import { Link, useLocation } from "react-router-dom";
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
import "./SideBar.css";

const navItems = [
  { label: "Dashboard", href: "/dashbord", icon: LayoutDashboard },
  { label: "Users", href: "/users", icon: Users },
  { label: "Departments", href: "/departements", icon: Building2 },
  { label: "Positions", href: "/positions", icon: Briefcase },
  { label: "Contracts", href: "/contrats", icon: FileText },
  { label: "Leaves", href: "/leaves", icon: Calendar },
  { label: "Presence", href: "/presence", icon: ClipboardCheck },
  { label: "Evaluations", href: "/evaluations", icon: Target },
  { label: "Predictions", href: "/predictions", icon: TrendingUp },
];

export default function SideBar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>PulseHR</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" className="sidebar-link">
          <Settings size={18} />
          Settings
        </Link>
      </div>
    </aside>
  );
}