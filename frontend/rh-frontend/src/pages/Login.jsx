import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-branding">
        <div className="login-branding-logo">
          <div className="login-branding-logo-icon" />
          <span>PulseHR</span>
        </div>

        <div>
          <h1 className="login-branding-title">
            Manage your workforce. Predict absenteeism. Make smarter decisions.
          </h1>
          <p className="login-branding-subtitle">
            PulseHR — Gestion RH intelligente
          </p>
        </div>

        <p className="login-branding-footer">
          © 2026 PulseHR. All rights reserved.
        </p>
      </div>

      <div className="login-form-section">
        <div className="login-form-box">
          <h2 className="login-form-title">Welcome back</h2>
          <p className="login-form-subtitle">
            Enter your credentials to access your account.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}