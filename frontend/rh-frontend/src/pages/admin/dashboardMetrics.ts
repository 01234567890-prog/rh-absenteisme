import type {
  ContratResponseDto,
  EvaluationResponseDto,
  LeaveResponseDto,
  PredictionResponseDto,
  PresenceResponseDto,
} from '../../types/api';

export interface DashboardMetrics {
  contractsToReview: number;
  leavesToday: LeaveResponseDto[];
  presentToday: number;
  absentToday: number;
  recordedAbsenceRate: number | null;
  overallEvaluationScore: number | null;
  highRiskPredictions: number;
  mediumRiskPredictions: number;
  lowRiskPredictions: number;
}

export const calculateDashboardMetrics = (
  contracts: ContratResponseDto[],
  leaves: LeaveResponseDto[],
  presences: PresenceResponseDto[],
  evaluations: EvaluationResponseDto[],
  predictions: PredictionResponseDto[],
  today: string
): DashboardMetrics => {
  const leavesToday = leaves.filter(
    (leave) => leave.status === 'APPROVED' && leave.startDate <= today && leave.endDate >= today
  );
  const todayPresences = presences.filter((presence) => presence.date === today);
  const measurablePresences = presences.filter((presence) => presence.status !== 'ON_LEAVE');
  const evaluationScores = evaluations.flatMap((evaluation) => [
    evaluation.performanceScore,
    evaluation.competencyScore,
    evaluation.behaviorScore,
  ]);

  return {
    contractsToReview: contracts.filter((contract) => ['EXPIRED', 'SUSPENDED'].includes(contract.status)).length,
    leavesToday,
    presentToday: todayPresences.filter((presence) => ['PRESENT', 'LATE'].includes(presence.status)).length,
    absentToday: todayPresences.filter((presence) => presence.status === 'ABSENT').length,
    recordedAbsenceRate: measurablePresences.length
      ? measurablePresences.filter((presence) => presence.status === 'ABSENT').length / measurablePresences.length * 100
      : null,
    overallEvaluationScore: evaluationScores.length
      ? evaluationScores.reduce((total, score) => total + score, 0) / evaluationScores.length
      : null,
    highRiskPredictions: predictions.filter((prediction) => prediction.level === 'HIGH').length,
    mediumRiskPredictions: predictions.filter((prediction) => prediction.level === 'MEDIUM').length,
    lowRiskPredictions: predictions.filter((prediction) => prediction.level === 'LOW').length,
  };
};
