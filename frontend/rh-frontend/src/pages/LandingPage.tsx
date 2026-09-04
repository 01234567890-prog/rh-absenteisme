import React from 'react';
import { Logo } from '../components/Logo';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Header / Navbar */}
      <header
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Logo onClick={() => onNavigate('/')} />
        <button
          onClick={() => onNavigate('/login')}
          style={{
            backgroundColor: '#4F6BFE',
            color: '#FFFFFF',
            padding: '10px 24px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </header>

      {/* Main Hero Section */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '40px 32px 80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}
      >
        {/* Left Text Column */}
        <div style={{ maxWidth: '560px' }}>
          <h1
            style={{
              fontSize: 'clamp(32px, 4vw, 36px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#111827',
            }}
          >
            Manage your workforce.
            <br />
            <span style={{ color: '#4F6BFE' }}>Predict absenteeism.</span>
            <br />
            Make smarter decisions.
          </h1>

          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#6B7280',
              marginTop: '24px',
              marginBottom: '32px',
            }}
          >
            PulseHR — Gestion RH intelligente. Centralize your HR data,
            automate attendance tracking, and let AI anticipate absenteeism
            before it happens.
          </p>

          <button
            onClick={() => onNavigate('/login')}
            style={{
              backgroundColor: '#4F6BFE',
              color: '#FFFFFF',
              padding: '14px 32px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(79, 107, 254, 0.3)',
            }}
          >
            Get Started
          </button>
        </div>

        {/* Right Preview Card */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
  style={{
    width: '100%',
    maxWidth: '520px',
    height: '380px',
    backgroundColor: '#EEF3FF',
    borderRadius: '24px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 20px 60px rgba(79, 107, 254, 0.12)',
  }}
>
  <img
    src="/photos/landingPage.jpg"
    alt="PulseHR"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    }}
  />
</div>
        </div>
      </main>
    </div>
  );
};
