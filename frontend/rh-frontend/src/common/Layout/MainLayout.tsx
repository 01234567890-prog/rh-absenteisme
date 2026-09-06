// src/common/Layout/MainLayout.tsx
import React from 'react';
import {Sidebar } from './Sidebar';
import {Topbar }from './Topbar';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface MainLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
  role: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentPath,
  onNavigate,
  children,
  navItems,
  title,
  role,
}) => {
  return (
    <div className="main-layout" style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        navItems={navItems}
        currentPath={currentPath}
        onNavigate={onNavigate}
        role={role}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar title={title} role={role} onNavigate={onNavigate} />
        <main style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          backgroundColor: '#f5f7fa',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};