type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

interface RiskRow {
  name: string;
  department: string;
  score: number;
  level: RiskLevel;
  period: string;
  predictedOn: string;
}

const mockRiskData: RiskRow[] = [
  { name: "Sami Araiedh", department: "IT", score: 0.78, level: "HIGH", period: "2026-Q1", predictedOn: "2026-08-10" },
  { name: "Amina Bouzid", department: "HR", score: 0.45, level: "MEDIUM", period: "2026-Q1", predictedOn: "2026-08-10" },
  { name: "Karim Salah", department: "Finance", score: 0.22, level: "LOW", period: "2026-Q1", predictedOn: "2026-08-10" },
];

const levelStyles: Record<RiskLevel, string> = {
  HIGH: "bg-red-50 text-red-600",
  MEDIUM: "bg-yellow-50 text-yellow-600",
  LOW: "bg-green-50 text-green-600",
};

export default function AbsenteeismRiskTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-500 mb-4">
        Employees at Risk of Absenteeism
      </h3>

      {mockRiskData.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">
          No predictions available yet. The AI model will generate risk
          assessments once enough historical data is collected.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-2 font-medium">Employee</th>
              <th className="pb-2 font-medium">Department</th>
              <th className="pb-2 font-medium">Score</th>
              <th className="pb-2 font-medium">Level</th>
              <th className="pb-2 font-medium">Period</th>
              <th className="pb-2 font-medium">Predicted On</th>
            </tr>
          </thead>
          <tbody>
            {mockRiskData.map((row) => (
              <tr key={row.name} className="border-b border-gray-50 last:border-0">
                <td className="py-3 font-medium text-gray-900">{row.name}</td>
                <td className="py-3 text-gray-500">{row.department}</td>
                <td className="py-3 text-gray-500">{(row.score * 100).toFixed(0)}%</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelStyles[row.level]}`}>
                    {row.level}
                  </span>
                </td>
                <td className="py-3 text-gray-500">{row.period}</td>
                <td className="py-3 text-gray-500">{row.predictedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}