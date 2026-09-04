import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { AbsenteeismPredictionPanel } from '../../components/admin/AbsenteeismPredictionPanel';
import { api } from '../../services/api';
import type { DepartementResponseDto, PredictionResponseDto, UserResponseDto } from '../../types/api';
import './PredictionsPage.css';

export const PredictionsPage: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionResponseDto[]>([]);
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [departements, setDepartements] = useState<DepartementResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    const [predictionsResult, usersResult, departmentsResult] = await Promise.allSettled([
      api.getPredictions(),
      api.getUsers(),
      api.getDepartements(),
    ]);
    if (predictionsResult.status === 'fulfilled') setPredictions(predictionsResult.value);
    if (usersResult.status === 'fulfilled') setUsers(usersResult.value);
    if (departmentsResult.status === 'fulfilled') setDepartements(departmentsResult.value);
    if (predictionsResult.status === 'rejected') {
      console.error('Error loading predictions:', predictionsResult.reason);
      const status = predictionsResult.reason?.response?.status;
      setErrorMsg(status === 401 || status === 403 ? `Prediction access denied (${status}).` : predictionsResult.reason?.message || 'Unable to load predictions.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="predictions-page">
      <div className="predictions-page-header">
        <div>
          <p className="eyebrow">AI-assisted workforce insight</p>
          <h1>Absenteeism Predictions</h1>
          <p>Consult the latest risk records generated for the workforce.</p>
        </div>
        <button onClick={loadData} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={15} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <AbsenteeismPredictionPanel
        predictions={predictions}
        users={users}
        departements={departements}
        loading={loading}
        error={errorMsg}
        onRetry={loadData}
      />
    </div>
  );
};
