import "./AbsenteeismRiskTable.css";

const mockRiskData = [
  { name: "Sami Araiedh", department: "IT", score: 0.78, level: "HIGH", period: "2026-Q1", predictedOn: "2026-08-10" },
  { name: "Amina Bouzid", department: "HR", score: 0.45, level: "MEDIUM", period: "2026-Q1", predictedOn: "2026-08-10" },
  { name: "Karim Salah", department: "Finance", score: 0.22, level: "LOW", period: "2026-Q1", predictedOn: "2026-08-10" },
];

export default function AbsenteeismRiskTable() {
  return (
    <div className="risk-table-card">
      <h3 className="risk-table-title">Employees at Risk of Absenteeism</h3>

      {mockRiskData.length === 0 ? (
        <div className="risk-empty">
          No predictions available yet. The AI model will generate risk
          assessments once enough historical data is collected.
        </div>
      ) : (
        <table className="risk-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Score</th>
              <th>Level</th>
              <th>Period</th>
              <th>Predicted On</th>
            </tr>
          </thead>
          <tbody>
            {mockRiskData.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.department}</td>
                <td>{(row.score * 100).toFixed(0)}%</td>
                <td>
                  <span className={`risk-badge ${row.level}`}>{row.level}</span>
                </td>
                <td>{row.period}</td>
                <td>{row.predictedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}