import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { findCurrentEmployee } from './employeeHelpers';
import type { EvaluationResponseDto, UserResponseDto } from '../../types/api';
import './MyEvaluationsPage.css';

export const MyEvaluationsPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    const results = await Promise.allSettled([api.getUsers(), api.getEvaluations()]);
    const [usersR, evalR] = results;
    if (usersR.status === 'fulfilled') setUsers(usersR.value);
    if (evalR.status === 'fulfilled') setEvaluations(evalR.value);
    else {
      const status = (evalR.reason as any)?.response?.status;
      setErrorMsg(status === 401 || status === 403 ? `Accès refusé (${status}).` : 'Impossible de charger vos évaluations.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const me = findCurrentEmployee(users);
  const myEvaluations = evaluations
    .filter((e) => e.evaluatedUserId === me?.id)
    .sort((a, b) => (a.evaluationDate < b.evaluationDate ? 1 : -1));

  const confirmedEvaluations = myEvaluations.filter((e) => e.confirmed);
  const avgOverall = confirmedEvaluations.length
    ? Math.round(
        confirmedEvaluations.reduce((total, e) => total + (e.performanceScore + e.competencyScore + e.behaviorScore) / 3, 0) /
          confirmedEvaluations.length
      )
    : 0;
  const bestScore = confirmedEvaluations.length
    ? Math.max(...confirmedEvaluations.map((e) => Math.round((e.performanceScore + e.competencyScore + e.behaviorScore) / 3)))
    : 0;

  const evaluatorName = (evaluatorId: number) => {
    const evaluator = users.find((u) => u.id === evaluatorId);
    return evaluator ? `${evaluator.firstName} ${evaluator.lastName}` : `#${evaluatorId}`;
  };

  return (
    <div className="myeval-container">
      <div className="myeval-header-row">
        <div>
          <h1 className="myeval-title">Mes évaluations</h1>
          <p className="myeval-subtitle">Consultez l'historique complet de vos évaluations de performance.</p>
        </div>
      </div>

      {errorMsg && <div className="page-error" role="alert"><span>{errorMsg}</span><button onClick={loadData}>Réessayer</button></div>}

      <div className="myeval-stats-row">
        <div className="myeval-stat"><p className="myeval-stat-value">{loading ? '...' : myEvaluations.length}</p><p className="myeval-stat-label">Évaluations reçues</p></div>
        <div className="myeval-stat"><p className="myeval-stat-value">{loading ? '...' : `${avgOverall}%`}</p><p className="myeval-stat-label">Score moyen</p></div>
        <div className="myeval-stat"><p className="myeval-stat-value">{loading ? '...' : `${bestScore}%`}</p><p className="myeval-stat-label">Meilleur score</p></div>
        <div className="myeval-stat"><p className="myeval-stat-value">{loading ? '...' : confirmedEvaluations.length}</p><p className="myeval-stat-label">Confirmées</p></div>
      </div>

      <div className="myeval-card">
        <p className="myeval-card-title">Historique des évaluations</p>
        <p className="myeval-card-subtitle">Cliquez sur une ligne pour voir le commentaire détaillé.</p>

        <table className="myeval-table">
          <thead>
            <tr><th>Période</th><th>Évaluateur</th><th>Performance</th><th>Compétence</th><th>Comportement</th><th>Global</th><th>Statut</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24 }}>Chargement...</td></tr>
            ) : myEvaluations.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24 }}>Aucune évaluation pour le moment.</td></tr>
            ) : (
              myEvaluations.map((ev) => {
                const overall = Math.round((ev.performanceScore + ev.competencyScore + ev.behaviorScore) / 3);
                const isExpanded = expandedId === ev.id;
                return (
                  <React.Fragment key={ev.id}>
                    <tr className="myeval-expand-row" onClick={() => setExpandedId(isExpanded ? null : ev.id)}>
                      <td>{ev.period}</td>
                      <td>{evaluatorName(ev.evaluatorId)}</td>
                      <td>{ev.performanceScore}%</td>
                      <td>{ev.competencyScore}%</td>
                      <td>{ev.behaviorScore}%</td>
                      <td className="myeval-overall">{overall}%</td>
                      <td><span className={`myeval-status-badge ${ev.confirmed ? 'confirmed' : 'draft'}`}>{ev.confirmed ? 'Confirmée' : 'Brouillon'}</span></td>
                    </tr>
                    {isExpanded && ev.comment && (
                      <tr>
                        <td colSpan={7}>
                          <div className="myeval-comment-row">
                            <p className="myeval-comment-label">Commentaire de l'évaluateur</p>
                            <p className="myeval-comment-text">{ev.comment}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};