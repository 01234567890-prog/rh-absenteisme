import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { api } from '../../api/client';
import { AbsenteeismPredictionPanel } from '../../components/admin/AbsenteeismPredictionPanel';
import { useAdminRefresh } from '../../components/admin/AdminRefreshContext';
import { AttendanceOverview } from './components/AttendanceOverview';
import { DashboardStats } from './components/DashboardStats';
import { DirectorySnapshot } from './components/DirectorySnapshot';
import { EvaluationScoreCard } from './components/EvaluationScoreCard';
import { WorkforceActions } from './components/WorkforceActions';
import { calculateDashboardMetrics } from './dashboardMetrics';
import type {
  ContratResponseDto,
  DepartementResponseDto,
  EvaluationResponseDto,
  LeaveResponseDto,
  PredictionResponseDto,
  PresenceResponseDto,
  PositionResponseDto,
  UserResponseDto,
} from '../../types/api';
import './AdminDashboard.css';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { register } = useAdminRefresh();
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [departements, setDepartements] = useState<DepartementResponseDto[]>([]);
  const [positions, setPositions] = useState<PositionResponseDto[]>([]);
  const [contracts, setContracts] = useState<ContratResponseDto[]>([]);
  const [leaves, setLeaves] = useState<LeaveResponseDto[]>([]);
  const [presences, setPresences] = useState<PresenceResponseDto[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationResponseDto[]>([]);
  const [predictions, setPredictions] = useState<PredictionResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [predictionLoading, setPredictionLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [predictionError, setPredictionError] = useState('');

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setPredictionLoading(true);
    setErrorMsg('');
    setPredictionError('');

    const results = await Promise.allSettled([
      api.getUsers(), api.getDepartements(), api.getPredictions(), api.getPositions(),
      api.getContrats(), api.getLeaves(), api.getPresences(), api.getEvaluations(),
    ]);
    const [usersResult, departmentsResult, predictionsResult, positionsResult, contractsResult, leavesResult, presencesResult, evaluationsResult] = results;

    if (usersResult.status === 'fulfilled') setUsers(usersResult.value);
    if (departmentsResult.status === 'fulfilled') setDepartements(departmentsResult.value);
    if (positionsResult.status === 'fulfilled') setPositions(positionsResult.value);
    if (contractsResult.status === 'fulfilled') setContracts(contractsResult.value);
    if (leavesResult.status === 'fulfilled') setLeaves(leavesResult.value);
    if (presencesResult.status === 'fulfilled') setPresences(presencesResult.value);
    if (evaluationsResult.status === 'fulfilled') setEvaluations(evaluationsResult.value);
    if (predictionsResult.status === 'fulfilled') setPredictions(predictionsResult.value);

    if (predictionsResult.status === 'rejected') {
      console.error('Error loading absenteeism predictions:', predictionsResult.reason);
      const status = predictionsResult.reason?.response?.status;
      setPredictionError(status === 401 || status === 403 ? `Prediction access denied (${status}).` : predictionsResult.reason?.message || 'Prediction data could not be loaded.');
    }

    const failures = results.filter((result) => result.status === 'rejected');
    if (failures.length > 0) {
      console.error('Error loading dashboard overview:', failures);
      setErrorMsg('Some overview data could not be loaded. Available sections remain visible.');
    }
    setLoading(false);
    setPredictionLoading(false);
  }, []);

  useEffect(() => { loadOverview(); }, [loadOverview]);
  useEffect(() => register(loadOverview, loading), [loadOverview, loading, register]);

  const activeEmployees = users.filter((user) => user.status === 'ACTIVE').length;
  const today = new Date().toISOString().slice(0, 10);
  const metrics = calculateDashboardMetrics(contracts, leaves, presences, evaluations, predictions, today);

  return (
    <Box className="dashboard-container">
      {errorMsg && <Alert severity="warning" action={<Button color="inherit" size="small" onClick={loadOverview}>Retry</Button>}>{errorMsg}</Alert>}
      <DashboardStats loading={loading} totalEmployees={users.length} activeEmployees={activeEmployees} departments={departements.length} />
      <Box className="dashboard-kpi-row">
        <WorkforceActions contractsToReview={metrics.contractsToReview} leavesToday={metrics.leavesToday.length} onNavigate={onNavigate} />
        <EvaluationScoreCard loading={loading} score={metrics.overallEvaluationScore} />
      </Box>
      <AttendanceOverview loading={loading} presentToday={metrics.presentToday} absentToday={metrics.absentToday} leaveToday={metrics.leavesToday.length} recordedAbsenceRate={metrics.recordedAbsenceRate} />
      <Box className="prediction-feature">
        <AbsenteeismPredictionPanel predictions={predictions} users={users} departements={departements} loading={predictionLoading} error={predictionError} onRetry={loadOverview} onViewAll={() => onNavigate('/admin/predictions')} />
      </Box>
      <DirectorySnapshot users={users} departments={departements} loading={loading} />
      <Box className="dashboard-source-note">Positions: {loading ? '...' : positions.length} · High-risk predictions: {predictionLoading ? '...' : metrics.highRiskPredictions} · Medium: {predictionLoading ? '...' : metrics.mediumRiskPredictions} · Low: {predictionLoading ? '...' : metrics.lowRiskPredictions}</Box>
    </Box>
  );
};
