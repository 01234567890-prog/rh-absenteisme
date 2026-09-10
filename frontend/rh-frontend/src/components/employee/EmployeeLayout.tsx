import React from 'react';
import { User, Calendar, Bell, FileText, LogOut } from 'lucide-react';
import { Logo } from '../Logo';
import { authService } from '../../services/authService';
import './EmployeeLayout.css';

interface EmployeeLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  unreadCount?: number;
  children: React.ReactNode;
}

export const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ currentPath, onNavigate, unreadCount = 0, children }) => {
  const handleLogout = () => {
    authService.logout();
    onNavigate('/login');
  };

  const navItems = [
  { label: 'Profil', path: '/employee/profile', icon: <User size={18} /> },
  { label: 'Mes évaluations', path: '/employee/evaluations', icon: <FileText size={18} /> },
  { label: 'Demande de congé', path: '/employee/leave', icon: <Calendar size={18} /> },
  { label: 'Notifications', path: '/employee/notifications', icon: <Bell size={18} />, badge: unreadCount },
];

  const email = localStorage.getItem('email') || 'Employee';
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="employee-container">
      <aside className="employee-sidebar">
        <div className="employee-sidebar-logo">
          <Logo onClick={() => onNavigate('/employee/profile')} />
        </div>
        <p className="employee-workspace-label">Employee Workspace</p>
        <nav className="employee-nav">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`employee-link ${currentPath === item.path ? 'active' : ''}`}
              onClick={() => onNavigate(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
              {!!item.badge && <span className="employee-badge">{item.badge}</span>}
            </div>
          ))}
        </nav>
        <div className="employee-user-card">
          <div className="employee-user-avatar">{initial}</div>
          <div className="employee-user-info">
            <div className="employee-user-name">{email}</div>
            <div className="employee-user-role">Software Developer</div>
          </div>
          <button className="employee-logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      <main className="employee-main">{children}</main>
    </div>
  );
};