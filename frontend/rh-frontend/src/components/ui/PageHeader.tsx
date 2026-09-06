// src/components/ui/PageHeader.tsx
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0a0a0a' }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};