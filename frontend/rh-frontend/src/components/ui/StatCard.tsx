// src/components/ui/StatCard.tsx
import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '20px', 
      borderRadius: '12px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
        {label}
      </p>
      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0a0a0a' }}>
        {value}
      </p>
    </div>
  );
};