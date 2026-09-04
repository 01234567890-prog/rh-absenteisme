import React from 'react';

interface LogoProps {
  textColor?: 'dark' | 'white' | 'blue';
  iconSize?: number;
  textSize?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  textColor = 'dark',
  iconSize = 34,
  textSize = '20px',
  onClick,
}) => {
  const getTextColor = () => {
    switch (textColor) {
      case 'white':
        return '#FFFFFF';
      case 'blue':
        return '#4F6BFE';
      case 'dark':
      default:
        return '#111827';
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          backgroundColor: '#4F6BFE',
          borderRadius: '10px',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          color: getTextColor(),
          fontSize: textSize,
          fontWeight: 700,
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          letterSpacing: '-0.02em',
        }}
      >
        PulseHR
      </span>
    </div>
  );
};
