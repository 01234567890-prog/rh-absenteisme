import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Users, FileText, CalendarOff, TrendingUp } from 'lucide-react';
import { api } from '../../api/client';
import { useAdminRefresh } from '../../components/admin/AdminRefreshContext';
import { calculateRhMetrics } from './RhMetrics';
import type {
  ContratResponseDto,
  LeaveResponseDto,
  PredictionResponseDto,
  UserResponseDto,
} from '../../types/api';
import './RhDashboard.css';

export const RhDashboard: React.FC = () => {
  const { register } = useAdminRefresh();
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [contracts, setContracts] = useState<ContratResponseDto[]>([]);
  const [leaves, setLeaves] = useState<LeaveResponseDto[]>([]);
  const [predictions, setPredictions] = useState<PredictionResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    const results = await Promise.allSettled([
      api.getUsers(),
      api.getContrats(),
      api.getLeaves(),
      api.getPredictions(),
    ]);
    const [usersResult, contractsResult, leavesResult, predictionsResult] = results;

    if (usersResult.status === 'fulfilled') setUsers(usersResult.value);
    if (contractsResult.status === 'fulfilled') setContracts(contractsResult.value);
    if (leavesResult.status === 'fulfilled') setLeaves(leavesResult.value);
    if (predictionsResult.status === 'fulfilled') setPredictions(predictionsResult.value);

    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length > 0) {
      console.error('RH dashboard load errors:', failed);
      setErrorMsg('Certaines données n\'ont pas pu être chargées.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => register(loadData, loading), [loadData, loading, register]);

  const metrics = calculateRhMetrics(users, contracts, leaves, predictions);
  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="rh-container">
      <div className="rh-header-row">
        <div>
          <p className="rh-eyebrow">Espace Responsable RH</p>
          <h1 className="rh-title">Vue d'ensemble RH</h1>
          <p className="rh-subtitle">Suivez les effectifs, les congés et les signaux d'absentéisme.</p>
        </div>
        <button className="rh-refresh-btn" onClick={loadData} disabled={loading}>
          <RefreshCw size={15} />
          {loading ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

      {errorMsg && <div className="page-error" role="alert"><span>{errorMsg}</span><button onClick={loadData}>Réessayer</button></div>}

      <div className="rh-stats-grid">
        <div className="rh-stat-card">
          <div className="rh-stat-top"><span className="rh-stat-label">Employés</span><Users size={18} className="rh-stat-icon" /></div>
          <p className="rh-stat-value">{loading ? '...' : metrics.totalEmployees}</p>
        </div>
        <div className="rh-stat-card">
          <div className="rh-stat-top"><span className="rh-stat-label">Contrats</span><FileText size={18} className="rh-stat-icon" /></div>
          <p className="rh-stat-value">{loading ? '...' : metrics.totalContracts}</p>
        </div>
        <div className="rh-stat-card">
          <div className="rh-stat-top"><span className="rh-stat-label">Congés en attente</span><CalendarOff size={18} className="rh-stat-icon" /></div>
          <p className="rh-stat-value">{loading ? '...' : metrics.pendingLeaves}</p>
        </div>
        <div className="rh-stat-card">
          <div className="rh-stat-top"><span className="rh-stat-label">Risque élevé</span><TrendingUp size={18} className="rh-stat-icon" /></div>
          <p className="rh-stat-value">{loading ? '...' : metrics.highRiskCount}</p>
        </div>
      </div>

      <div className="rh-mid-row">
        <div className="rh-card">
          <p className="rh-card-eyebrow">Demandes de congé</p>
          <div className="rh-card-title-row"><span className="rh-card-title">Suivi des décisions</span></div>
          <div className="rh-leave-summary">
            <div className="rh-leave-box"><strong>{loading ? '...' : metrics.pendingLeaves}</strong><span>En attente</span></div>
            <div className="rh-leave-box"><strong>{loading ? '...' : metrics.approvedLeaves}</strong><span>Approuvées</span></div>
            <div className="rh-leave-box"><strong>{loading ? '...' : metrics.rejectedLeaves}</strong><span>Refusées</span></div>
          </div>
          <p className="rh-leave-note">Les demandes sont synchronisées avec le service des congés.</p>
        </div>

        <div className="rh-card">
          <p className="rh-card-eyebrow">Prévisions</p>
          <div className="rh-card-title-row"><span className="rh-card-title">Répartition du risque</span></div>
          <div className="rh-risk-list">
            <div className="rh-risk-row"><span className="rh-risk-label"><span className="rh-risk-dot high" />Élevé</span><span className="rh-risk-count">{loading ? '...' : metrics.highRiskCount}</span></div>
            <div className="rh-risk-row"><span className="rh-risk-label"><span className="rh-risk-dot medium" />Moyen</span><span className="rh-risk-count">{loading ? '...' : metrics.mediumRiskCount}</span></div>
            <div className="rh-risk-row"><span className="rh-risk-label"><span className="rh-risk-dot low" />Faible</span><span className="rh-risk-count">{loading ? '...' : metrics.lowRiskCount}</span></div>
          </div>
        </div>
      </div>

      <div className="rh-card">
        <p className="rh-card-eyebrow">Aide à la décision</p>
        <div className="rh-predictions-header">
          <span className="rh-card-title">Prévisions d'absentéisme</span>
        </div>
        <table className="rh-table">
          <thead>
            <tr><th>Employé</th><th>Département</th><th>Score</th><th>Niveau</th><th>Période</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>Chargement...</td></tr>
            ) : predictions.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>Aucune prévision disponible.</td></tr>
            ) : (
              predictions.slice(0, 5).map((prediction) => {
                const user = userMap.get(prediction.userId);
                return (
                  <tr key={prediction.id}>
                    <td>{user ? `${user.firstName} ${user.lastName}` : `#${prediction.userId}`}</td>
                    <td>{user?.departementId ?? '-'}</td>
                    <td>{Math.round(prediction.score <= 1 ? prediction.score * 100 : prediction.score)}%</td>
                    <td><span className={`rh-level-badge ${prediction.level}`}>{prediction.level}</span></td>
                    <td>{prediction.analysisPeriod}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};