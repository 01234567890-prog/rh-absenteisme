// src/components/common/Layout/Sidebar.tsx
import React from 'react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
  role: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  currentPath,
  onNavigate,
  role,
}) => {
  return (
    <aside style={{
      width: '250px',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ color: '#2563eb' }}>PulseHR</h2>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>{role}</span>
      </div>
      <nav style={{ flex: 1, padding: '16px' }}>
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: currentPath === item.path ? '#dbeafe' : 'transparent',
              color: currentPath === item.path ? '#2563eb' : '#4b5563',
              cursor: 'pointer',
              marginBottom: '4px',
              fontWeight: currentPath === item.path ? '600' : '400',
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};