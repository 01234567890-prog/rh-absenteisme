import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-navbar">
        <div className="landing-logo">
          <div className="landing-logo-icon" />
          <span>PulseHR</span>
        </div>

        <button className="landing-login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>

      <div className="landing-hero">
        <div className="landing-hero-text">
          <h1 className="landing-hero-title">
            Manage your workforce.<br />
            <span>Predict absenteeism.</span><br />
            Make smarter decisions.
          </h1>
          <p className="landing-hero-subtitle">
            PulseHR — Gestion RH intelligente. Centralize your HR data,
            automate attendance tracking, and let AI anticipate absenteeism
            before it happens.
          </p>
          <button className="landing-login-btn" onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>

        <div className="landing-hero-image">
          <img src="https://placehold.co/600x450/eef1fd/4763e4?text=PulseHR" alt="PulseHR dashboard preview" />
        </div>
      </div>
    </div>
  );
}