import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { AbsenteeismPredictionPanel } from '../../components/admin/AbsenteeismPredictionPanel';
import { api } from '../../api/client';
import type { DepartementResponseDto, PredictionResponseDto, UserResponseDto } from '../../types/api';
import './PredictionsPage.css';

export const RhPredictionsPage: React.FC = () => {
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
      const status = (predictionsResult.reason as any)?.response?.status;
      setErrorMsg(status === 401 || status === 403 ? `Accès refusé (${status}).` : 'Impossible de charger les prédictions.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="predictions-page">
      <div className="predictions-page-header">
        <div>
          <p className="eyebrow">Aide à la décision IA</p>
          <h1>Prévisions d'absentéisme</h1>
          <p>Consultez les derniers scores de risque générés pour vos équipes.</p>
        </div>
        <button onClick={loadData} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={15} />
          {loading ? 'Actualisation...' : 'Actualiser'}
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