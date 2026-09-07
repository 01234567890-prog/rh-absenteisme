import React, { useCallback, useEffect, useState } from 'react';
import { FileText, Search, X } from 'lucide-react';
import { api } from '../../api/client';
import { findCurrentManager, getTeamMembers } from './managerHelpers';
import type { EvaluationPeriod, EvaluationResponseDto, UserResponseDto } from '../../types/api';
import './EvaluationsPage.css';

interface EvalFormValues {
  evaluatedUserId?: number;
  period: EvaluationPeriod;
  performanceScore: string;
  competencyScore: string;
  behaviorScore: string;
  comment: string;
}

const emptyForm: EvalFormValues = {
  evaluatedUserId: undefined,
  period: 'QUARTERLY',
  performanceScore: '',
  competencyScore: '',
  behaviorScore: '',
  comment: '',
};

export const EvaluationsPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<EvalFormValues>(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    const [usersResult, evalResult] = await Promise.allSettled([
      api.getUsers(),
      api.getEvaluations(),
    ]);
    if (usersResult.status === 'fulfilled') setUsers(usersResult.value);
    if (evalResult.status === 'fulfilled') setEvaluations(evalResult.value);
    else {
      const status = (evalResult.reason as any)?.response?.status;
      setErrorMsg(status === 401 || status === 403 ? `Accès refusé (${status}).` : 'Impossible de charger les évaluations.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const currentManager = findCurrentManager(users);
  const team = getTeamMembers(users, currentManager?.id);
  console.log('USERS:', users);
  console.log('CURRENT MANAGER:', currentManager);
  console.log('TEAM:', team);
  const teamIds = new Set(team.map((u) => u.id));
  const teamEvaluations = evaluations.filter((e) => teamIds.has(e.evaluatedUserId));
  const filtered = teamEvaluations.filter((e) => {
    const user = users.find((u) => u.id === e.evaluatedUserId);
    const name = user ? `${user.firstName} ${user.lastName}`.toLowerCase() : '';
    return name.includes(search.toLowerCase());
  });

  const confirmedCount = teamEvaluations.filter((e) => e.confirmed).length;
  const draftCount = teamEvaluations.filter((e) => !e.confirmed).length;
  const avgOverall = teamEvaluations.length
    ? Math.round(
        teamEvaluations.reduce((total, e) => total + (e.performanceScore + e.competencyScore + e.behaviorScore) / 3, 0) /
          teamEvaluations.length
      )
    : 0;

  const userName = (id: number) => {
    const u = users.find((user) => user.id === id);
    return u ? `${u.firstName} ${u.lastName}` : `#${id}`;
  };

  const openModal = () => {
    setFormValues(emptyForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const setValue = <K extends keyof EvalFormValues>(key: K, value: EvalFormValues[K]) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.evaluatedUserId || !currentManager) {
      setFormError('Veuillez sélectionner un employé.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await api.createEvaluation({
        evaluatedUserId: formValues.evaluatedUserId,
        evaluatorId: currentManager.id,
        period: formValues.period,
        performanceScore: Number(formValues.performanceScore),
        competencyScore: Number(formValues.competencyScore),
        behaviorScore: Number(formValues.behaviorScore),
        evaluationDate: new Date().toISOString().slice(0, 10),
        comment: formValues.comment,
      });
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setFormError(err.message || "Impossible de créer l'évaluation.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async (evaluationId: number) => {
    setConfirmingId(evaluationId);
    try {
      await api.confirmEvaluation(evaluationId);
      await loadData();
    } catch (err: any) {
      alert('Erreur : ' + (err.message || 'impossible de confirmer.'));
    } finally {
      setConfirmingId(null);
    }
  };

  const selectedUser = users.find((u) => u.id === formValues.evaluatedUserId);

  return (
    <div className="eval-container">
      <div className="eval-header-row">
        <div>
          <p className="eval-eyebrow">Performance Management</p>
          <h1 className="eval-title">Employee evaluations</h1>
          <p className="eval-subtitle">Review evaluation periods, objectives and performance across your team.</p>
        </div>
        <button className="eval-new-btn" onClick={openModal}>
          <FileText size={16} /> New evaluation
        </button>
      </div>

      {errorMsg && <div className="page-error" role="alert"><span>{errorMsg}</span><button onClick={loadData}>Réessayer</button></div>}

      <div className="eval-stats-row">
        <div className="eval-stat"><p className="eval-stat-value">{loading ? '...' : teamEvaluations.length}</p><p className="eval-stat-label">Evaluations this quarter</p></div>
        <div className="eval-stat"><p className="eval-stat-value">{loading ? '...' : `${avgOverall}%`}</p><p className="eval-stat-label">Average overall score</p></div>
        <div className="eval-stat"><p className="eval-stat-value">{loading ? '...' : confirmedCount}</p><p className="eval-stat-label">Confirmed evaluations</p></div>
        <div className="eval-stat"><p className="eval-stat-value">{loading ? '...' : draftCount}</p><p className="eval-stat-label">Draft to complete</p></div>
      </div>

      <div className="eval-card">
        <div className="eval-table-header-row">
          <div><p className="eval-card-title">Evaluation history</p><p className="eval-card-subtitle">Quarterly reviews for your team</p></div>
          <div className="eval-search"><Search size={14} color="#94A3B8" /><input placeholder="Search employee" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </div>

        <table className="eval-table">
          <thead><tr><th>Employee</th><th>Period</th><th>Performance</th><th>Competence</th><th>Behaviour</th><th>Overall</th><th>Status</th><th /></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24 }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24 }}>No evaluations found.</td></tr>
            ) : (
              filtered.map((ev) => {
                const overall = Math.round((ev.performanceScore + ev.competencyScore + ev.behaviorScore) / 3);
                const user = users.find((u) => u.id === ev.evaluatedUserId);
                return (
                  <tr key={ev.id}>
                    <td>
                      <div className="eval-employee-cell">
                        <div className="eval-avatar">{(user?.firstName?.[0] || '?').toUpperCase()}{(user?.lastName?.[0] || '').toUpperCase()}</div>
                        <div className="eval-employee-name">{userName(ev.evaluatedUserId)}</div>
                      </div>
                    </td>
                    <td>{ev.period}</td>
                    <td>{ev.performanceScore}%</td>
                    <td>{ev.competencyScore}%</td>
                    <td>{ev.behaviorScore}%</td>
                    <td className="eval-overall">{overall}%</td>
                    <td><span className={`eval-status-badge ${ev.confirmed ? 'confirmed' : 'draft'}`}>{ev.confirmed ? 'Confirmed' : 'Draft'}</span></td>
                    <td>
                      <button className="eval-view-btn">View</button>
                      {!ev.confirmed && (
                        <button className="eval-confirm-btn" disabled={confirmingId === ev.id} onClick={() => handleConfirm(ev.id)}>
                          {confirmingId === ev.id ? '...' : 'Confirm'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="eval-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="eval-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="eval-modal-header">
              <div>
                <p className="eval-modal-category">Nouvelle évaluation</p>
                <h2 className="eval-modal-title">Évaluer un employé</h2>
                <p className="eval-modal-subtitle">Complétez les critères de performance et l'objectif atteint.</p>
              </div>
              <button className="eval-modal-close" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>

            {selectedUser && (
              <div className="eval-employee-banner">
                <div className="eval-avatar">{selectedUser.firstName[0]}{selectedUser.lastName[0]}</div>
                <div className="eval-employee-name">{selectedUser.firstName} {selectedUser.lastName}</div>
                <span className="eval-banner-status">Évaluation en cours</span>
              </div>
            )}

            {formError && <div className="modal-error">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="eval-form-grid">
                <div className="eval-form-group">
                  <label>Employé</label>
                  <select value={formValues.evaluatedUserId ?? ''} onChange={(e) => setValue('evaluatedUserId', Number(e.target.value))} required>
                    <option value="" disabled>Sélectionner</option>
                    {team.map((u) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                  </select>
                </div>
                <div className="eval-form-group">
                  <label>Période</label>
                  <select value={formValues.period} onChange={(e) => setValue('period', e.target.value as EvaluationPeriod)}>
                    <option value="MONTHLY">Mensuelle</option>
                    <option value="QUARTERLY">Trimestrielle</option>
                    <option value="SEMI_ANNUAL">Semestrielle</option>
                    <option value="ANNUAL">Annuelle</option>
                  </select>
                </div>
                <div className="eval-form-group">
                  <label>Note de performance</label>
                  <input type="number" min={0} max={100} value={formValues.performanceScore} onChange={(e) => setValue('performanceScore', e.target.value)} required />
                  <span className="hint">Score de 0 à 100</span>
                </div>
                <div className="eval-form-group">
                  <label>Note de compétence</label>
                  <input type="number" min={0} max={100} value={formValues.competencyScore} onChange={(e) => setValue('competencyScore', e.target.value)} required />
                  <span className="hint">Score de 0 à 100</span>
                </div>
                <div className="eval-form-group">
                  <label>Note de comportement</label>
                  <input type="number" min={0} max={100} value={formValues.behaviorScore} onChange={(e) => setValue('behaviorScore', e.target.value)} required />
                  <span className="hint">Score de 0 à 100</span>
                </div>
                <div className="eval-form-group full">
                  <label>Commentaire</label>
                  <textarea value={formValues.comment} onChange={(e) => setValue('comment', e.target.value)} placeholder="Commentaire sur la performance..." />
                </div>
              </div>

              <div className="eval-modal-actions">
                <button type="button" className="eval-cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="eval-submit-btn" disabled={submitting}>{submitting ? 'Saving...' : 'Save evaluation'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};