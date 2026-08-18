import { Search, Bell } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const email = localStorage.getItem("email") || "";
  const initial = email.charAt(0).toUpperCase() || "U";

  return (
    <header className="navbar">
      <div className="navbar-search">
        <Search size={16} color="#8b8fa3" />
        <input type="text" placeholder="Search anything..." />
      </div>

      <div className="navbar-actions">
        <button className="navbar-bell">
          <Bell size={18} color="#4b4f5f" />
          <span className="navbar-bell-dot" />
        </button>

        <div className="navbar-avatar">{initial}</div>
      </div>
    </header>
  );
}