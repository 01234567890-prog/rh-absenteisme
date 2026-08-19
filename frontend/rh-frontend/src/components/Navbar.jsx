import { useEffect, useState } from "react";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

export default function Navbar() {
  const email = localStorage.getItem("email") || "";
  const initial = email.charAt(0).toUpperCase() || "U";
  const { darkMode, setDarkMode } = useTheme();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const dateTimeStr = now.toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="navbar">
      <div className="navbar-search">
        <Search size={16} color="#8b8fa3" />
        <input type="text" placeholder="Search anything..." />
      </div>

      <div className="navbar-actions">
        <span className="navbar-datetime">{dateTimeStr}</span>

        <button
          className="navbar-theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button className="navbar-bell">
          <Bell size={18} color="#4b4f5f" />
          <span className="navbar-bell-dot" />
        </button>

        <div className="navbar-avatar">{initial}</div>
      </div>
    </header>
  );
}