import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { authService } from '../services/authService';
import './LoginPage.css';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg('');

  try {
    const authenticatedUser = await authService.login({ email, password });
    if (authenticatedUser.role === 'ADMIN') {
      onNavigate('/admin/dashboard');
    } else if (authenticatedUser.role === 'RH_MANAGER') {
      onNavigate('/rh/dashboard');
    } else {
      onNavigate('/');
    }
  } catch (err: any) {
    setErrorMsg(err.message || 'Login failed. Please check your credentials.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      {/* Left Dark Column */}
      <div className="login-left">
        <div>
          <Logo textColor="white" onClick={() => onNavigate('/')} />
        </div>

        <div className="login-left-content">
          <h2 className="login-left-title">
            Manage your workforce. Predict absenteeism. Make smarter decisions.
          </h2>
          <p className="login-left-subtitle">
            PulseHR — Gestion RH intelligente
          </p>
        </div>

        <div>
          <p className="login-copyright">
            © 2026 PulseHR. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right White Form Column */}
      <div className="login-right">
        <div className="login-form-box">
          <h2 className="login-form-title">Welcome back</h2>
          <p className="login-form-subtitle">
            Enter your credentials to access your account.
          </p>

          {errorMsg && <div className="error-banner">{errorMsg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-field" style={{ marginBottom: '28px' }}>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
