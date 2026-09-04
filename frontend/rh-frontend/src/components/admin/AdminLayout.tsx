import React, { useCallback, useMemo, useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import {
  Award,
  Bell,
  Briefcase,
  Building2,
  CalendarOff,
  Clock,
  FileText,
  LayoutDashboard,
  LogOut,
  Moon,
  RefreshCw,
  Search,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Logo } from '../Logo';
import { authService } from '../../services/authService';
import { AdminRefreshContext } from './AdminRefreshContext';
import './AdminLayout.css';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  onNavigate,
  children,
}) => {
  const [refreshState, setRefreshState] = useState<{ refresh: () => void; loading: boolean } | null>(null);

  const registerRefresh = useCallback((refresh: () => void, loading: boolean) => {
    setRefreshState({ refresh, loading });
    return () => setRefreshState((current) => current?.refresh === refresh ? null : current);
  }, []);

  const refreshContextValue = useMemo(() => ({
    loading: refreshState?.loading ?? false,
    refresh: refreshState?.refresh ?? (() => undefined),
    register: registerRefresh,
  }), [refreshState, registerRefresh]);

  const handleLogout = () => {
    authService.logout();
    onNavigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Users', path: '/admin/users', icon: <Users size={18} /> },
    { label: 'Roles', path: '/admin/roles', icon: <Shield size={18} /> },
    { label: 'Departments', path: '/admin/departments', icon: <Building2 size={18} /> },
    { label: 'Positions', path: '/admin/positions', icon: <Briefcase size={18} /> },
    { label: 'Contracts', path: '/admin/contracts', icon: <FileText size={18} /> },
    { label: 'Leaves', path: '/admin/leaves', icon: <CalendarOff size={18} /> },
    { label: 'Présences', path: '/admin/presences', icon: <Clock size={18} /> },
    { label: 'Évaluations', path: '/admin/evaluations', icon: <Award size={18} /> },
    { label: 'Prédictions', path: '/admin/predictions', icon: <TrendingUp size={18} /> },
  ];

  const userEmail = localStorage.getItem('email') || 'Authenticated user';
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <Logo onClick={() => onNavigate('/admin/dashboard')} />
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

      {/* Main Container */}
      <div className="admin-main-wrapper">
        {/* Top Navbar */}
        <header className="admin-header">
          <div className="header-search">
            <Search size={18} style={{ color: '#94A3B8' }} />
            <input type="text" placeholder="Search anything..." />
          </div>

          <div className="header-right">
            <div className="header-date-badge">Wed 19 Aug, 18:17</div>

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

            <Button
              className="navbar-refresh-btn"
              variant="outlined"
              size="small"
              startIcon={<RefreshCw size={15} />}
              onClick={refreshContextValue.refresh}
              disabled={!refreshState || refreshContextValue.loading}
            >
              {refreshContextValue.loading ? 'Refreshing...' : 'Refresh data'}
            </Button>

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

        {/* Content Body */}
        <AdminRefreshContext.Provider value={refreshContextValue}>
          <main className="admin-content">{children}</main>
        </AdminRefreshContext.Provider>
      </div>
    </div>
  );
};
