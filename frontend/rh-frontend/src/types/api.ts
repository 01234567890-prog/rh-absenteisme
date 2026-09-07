export type RoleName = 'ADMIN' | 'RH_MANAGER' | 'MANAGER' | 'EMPLOYEE';

export type UserStatus = 'ACTIVE' | 'EN_LEAVE' | 'SUSPENDED' | 'RESIGNED' | 'TERMINATED';

export type ContratType = 'CDI' | 'CDD' | 'INTERIM' | 'STAGE' | 'ALTERNANCE';

export type ContratStatus = 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'SUSPENDED';

export type LeaveType = 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNEITY' | 'UNPAID' | 'SPECIAL';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export type PresenceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE';

export type EvaluationPeriod = 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';

export type ObjectiveStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ACHIEVED' | 'NOT_ACHIEVED';

export type PredictionLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AuthResponseDto {
  token: string;
  email: string;
  role: string;
}

export interface UserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  createddate?: string;
  hireDate?: string;
  status?: UserStatus;
  departementId?: number;
  roleId?: number;
  positionId?: number;
  managerId?: number;
}

export interface UserRequestDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password?: string;
  hireDate: string;
  status: UserStatus;
  departementId?: number;
  roleId?: number;
  positionId?: number;
  managerId?: number;
}

export interface UserUpdateRequestDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null ;
  status?: UserStatus;
  departementId?: number;
  roleId?: number;
  positionId?: number;
  managerId?: number;
}

export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface DepartementResponseDto {
  id: number;
  name: string;
  description?: string;
}

export interface DepartementRequestDto {
  name: string;
  description?: string;
}

export interface PositionResponseDto {
  id: number;
  title: string;
  description?: string;
}

export interface PositionRequestDto {
  title: string;
  description?: string;
}

export interface RoleResponseDto {
  id: number;
  name: RoleName;
}

export interface LeaveResponseDto {
  id: number;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason?: string;
  userId: number;
}
export interface LeaveUpdateRequestDto {
  status: LeaveStatus;
}

export interface PredictionResponseDto {
  id: number;
  score: number;
  level: PredictionLevel;
  predictionDate: string;
  analysisPeriod: string;
  userId: number;
}

export interface ContratResponseDto {
  id: number;
  type: ContratType;
  baseSalary: number;
  signatureDate: string;
  startDate: string;
  endDate: string;
  status: ContratStatus;
  userId: number;
}

export interface ContratRequestDto {
  type: ContratType;
  baseSalary: number;
  signatureDate: string;
  startDate: string;
  endDate: string;
  status: ContratStatus;
  userId: number;
}

export interface PresenceResponseDto {
  id: number;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: PresenceStatus;
  userId: number;
}

export interface EvaluationResponseDto {
  id: number;
  period: EvaluationPeriod;
  performanceScore: number;
  competencyScore: number;
  behaviorScore: number;
  evaluationDate: string;
  comment?: string;
  confirmed: boolean;
  evaluatedUserId: number;
  evaluatorId: number;
}
