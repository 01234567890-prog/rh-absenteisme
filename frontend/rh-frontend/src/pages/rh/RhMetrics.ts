import type {
  ContratResponseDto,
  LeaveResponseDto,
  PredictionResponseDto,
  UserResponseDto,
} from '../../types/api';

export interface RhMetrics {
  totalEmployees: number;
  totalContracts: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
}

export const calculateRhMetrics = (
  users: UserResponseDto[],
  contracts: ContratResponseDto[],
  leaves: LeaveResponseDto[],
  predictions: PredictionResponseDto[]
): RhMetrics => ({
  totalEmployees: users.length,
  totalContracts: contracts.length,
  pendingLeaves: leaves.filter((leave) => leave.status === 'PENDING').length,
  approvedLeaves: leaves.filter((leave) => leave.status === 'APPROVED').length,
  rejectedLeaves: leaves.filter((leave) => leave.status === 'REJECTED').length,
  highRiskCount: predictions.filter((prediction) => prediction.level === 'HIGH').length,
  mediumRiskCount: predictions.filter((prediction) => prediction.level === 'MEDIUM').length,
  lowRiskCount: predictions.filter((prediction) => prediction.level === 'LOW').length,
});