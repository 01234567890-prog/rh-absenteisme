import React from 'react';
import { LayoutDashboard, FileText, Clock, LogOut } from 'lucide-react';
import { Logo } from '../Logo';
import { authService } from '../../services/authService';
import './ManagerLayout.css';

interface ManagerLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const ManagerLayout: React.FC<ManagerLayoutProps> = ({ currentPath, onNavigate, children }) => {
  const handleLogout = () => {
    authService.logout();
    onNavigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Evaluations', path: '/manager/evaluations', icon: <FileText size={18} /> },
    { label: 'Attendance', path: '/manager/attendance', icon: <Clock size={18} /> },
  ];

  const email = localStorage.getItem('email') || 'Manager';
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="manager-container">
      <aside className="manager-sidebar">
        <div className="manager-sidebar-logo">
          <Logo onClick={() => onNavigate('/manager/dashboard')} />
        </div>
        <p className="manager-workspace-label">Manager Workspace</p>
        <nav className="manager-nav">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`manager-link ${currentPath === item.path ? 'active' : ''}`}
              onClick={() => onNavigate(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="manager-user-card">
          <div className="manager-user-avatar">{initial}</div>
          <div className="manager-user-info">
            <div className="manager-user-name">{email}</div>
            <div className="manager-user-role">Team Manager</div>
          </div>
          <button className="manager-logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      <main className="manager-main">{children}</main>
    </div>
  );
};