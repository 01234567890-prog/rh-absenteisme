import React, { useCallback, useMemo, useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import {
  Bell,
  CalendarOff,
  FileText,
  LayoutDashboard,
  LogOut,
  Moon,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Logo } from '../Logo';
import { authService } from '../../services/authService';
import { AdminRefreshContext } from '../admin/AdminRefreshContext';
import '../admin/AdminLayout.css';

interface RhLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const RhLayout: React.FC<RhLayoutProps> = ({ currentPath, onNavigate, children }) => {
  const [refreshState, setRefreshState] = useState<{ refresh: () => void; loading: boolean } | null>(null);

  const registerRefresh = useCallback((refresh: () => void, loading: boolean) => {
    setRefreshState({ refresh, loading });
    return () => setRefreshState((current) => (current?.refresh === refresh ? null : current));
  }, []);

  const refreshContextValue = useMemo(
    () => ({
      loading: refreshState?.loading ?? false,
      refresh: refreshState?.refresh ?? (() => undefined),
      register: registerRefresh,
    }),
    [refreshState, registerRefresh]
  );

  const handleLogout = () => {
    authService.logout();
    onNavigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/rh/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Employees', path: '/rh/employees', icon: <Users size={18} /> },
    { label: 'Contracts', path: '/rh/contracts', icon: <FileText size={18} /> },
    { label: 'Leaves', path: '/rh/leaves', icon: <CalendarOff size={18} /> },
    { label: 'Predictions', path: '/rh/predictions', icon: <TrendingUp size={18} /> },
  ];

  const userEmail = localStorage.getItem('email') || 'Authenticated user';
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <Logo onClick={() => onNavigate('/rh/dashboard')} />
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <div
                key={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="admin-main-wrapper">
        <header className="admin-header">
          <div className="header-search">
            <Search size={18} style={{ color: '#94A3B8' }} />
            <input type="text" placeholder="Rechercher un employé" />
          </div>

          <div className="header-right">
            <div className="header-date-badge">
              {new Date().toLocaleString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </div>

            <Tooltip title="Toggle theme">
              <button className="icon-btn" aria-label="Toggle theme">
                <Moon size={18} />
              </button>
            </Tooltip>

            <Tooltip title="Notifications">
              <button className="icon-btn" aria-label="Notifications">
                <span className="notification-dot" />
                <Bell size={18} />
              </button>
            </Tooltip>

            

            <div className="user-avatar" title={userEmail}>
              {initial}
            </div>

            <Tooltip title="Sign out">
              <button className="logout-btn" onClick={handleLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <LogOut size={16} />
                Logout
              </button>
            </Tooltip>
          </div>
        </header>

        <AdminRefreshContext.Provider value={refreshContextValue}>
          <main className="admin-content">{children}</main>
        </AdminRefreshContext.Provider>
      </div>
    </div>
  );
};