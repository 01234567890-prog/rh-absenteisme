import type { EvaluationResponseDto, LeaveResponseDto, PresenceResponseDto, UserResponseDto } from '../../types/api';

export interface ManagerMetrics {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  pendingLeaves: number;
  avgEvaluationScore: number | null;
  attendanceRate: number;
}

export const calculateManagerMetrics = (
  team: UserResponseDto[],
  presencesToday: PresenceResponseDto[],
  leaves: LeaveResponseDto[],
  evaluations: EvaluationResponseDto[]
): ManagerMetrics => {
  const teamIds = new Set(team.map((u) => u.id));
  const teamPresences = presencesToday.filter((p) => teamIds.has(p.userId));
  const teamLeaves = leaves.filter((l) => teamIds.has(l.userId));
  const teamEvaluations = evaluations.filter((e) => teamIds.has(e.evaluatedUserId));

  const present = teamPresences.filter((p) => p.status === 'PRESENT' || p.status === 'LATE').length;
  const absent = teamPresences.filter((p) => p.status === 'ABSENT').length;
  const onLeave = teamPresences.filter((p) => p.status === 'ON_LEAVE').length;

  const scores = teamEvaluations.flatMap((e) => [e.performanceScore, e.competencyScore, e.behaviorScore]);
  const avgScore = scores.length ? scores.reduce((t, s) => t + s, 0) / scores.length : null;

  return {
    totalEmployees: team.length,
    presentToday: present,
    absentToday: absent,
    onLeaveToday: onLeave,
    pendingLeaves: teamLeaves.filter((l) => l.status === 'PENDING').length,
    avgEvaluationScore: avgScore,
    attendanceRate: team.length ? Math.round((present / team.length) * 100) : 0,
  };
};