import "./EvaluationGaugeCard.css";

const mockScore = 68;
const target = 80;

export default function EvaluationGaugeCard() {
  const radius = 70;
  const circumference = Math.PI * radius;
  const progress = (mockScore / 100) * circumference;

  return (
    <div className="gauge-card">
      <div className="gauge-card-header">
        <span className="gauge-card-title">Overall Evaluation Score</span>
        <button className="gauge-card-menu">⋯</button>
      </div>

      <div className="gauge-wrapper">
        <svg width="180" height="100" viewBox="0 0 180 100">
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke="#eef0f4"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke="#4763e4"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
          />
        </svg>
        <div className="gauge-value">{mockScore}%</div>
      </div>

      <p className="gauge-subtitle">On track for {target}% target</p>

      <button className="gauge-details-btn">Show details</button>
    </div>
  );
}