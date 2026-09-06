// src/common/Layout/Topbar.tsx
import React from 'react';

interface TopbarProps {
  title: string;
  role: string;
  onNavigate: (path: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ title, role, onNavigate }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    onNavigate('/login');
  };

  return (
    <header style={{
      height: '65px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
    }}>
      <div>
        <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#0a0a0a' }}>
          {title}
        </h1>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>{role}</span>
      </div>
      
      <button
        onClick={handleLogout}
        style={{
          padding: '8px 16px',
          backgroundColor: '#f3f4f6',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#4b5563',
        }}
      >
        Logout
      </button>
    </header>
  );
};