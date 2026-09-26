import React, { useCallback, useEffect, useState } from 'react';
import { Check, Calendar, ShieldCheck } from 'lucide-react';
import { api } from '../../api/client';
import { findCurrentEmployee } from './employeeHelpers';
import type { LeaveResponseDto, LeaveType, UserResponseDto } from '../../types/api';
import './LeaveRequestPage.css';

const dayCount = (start: string, end: string) => {
  if (!start || !end) return 0;
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 ? Math.round(diff) + 1 : 0;
};

export const LeaveRequestPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [leaves, setLeaves] = useState<LeaveResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [type, setType] = useState<LeaveType>('ANUAL' as LeaveType);
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled([api.getUsers(), api.getLeaves()]);
    const [usersR, leavesR] = results;
    if (usersR.status === 'fulfilled') setUsers(usersR.value);
    if (leavesR.status === 'fulfilled') setLeaves(leavesR.value);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const me = findCurrentEmployee(users);
  const myLeaves = leaves.filter((l) => l.userId === me?.id).sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  const usedDays = myLeaves.filter((l) => l.status === 'APPROVED' && l.type === ('ANUAL' as LeaveType)).reduce((t, l) => t + dayCount(l.startDate, l.endDate), 0);
  const balance = Math.max(24 - usedDays, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me) return;
    setSubmitting(true);
    setFormError('');
    try {
      await api.createLeave({ type, startDate, endDate, reason, userId: me.id });
      setType('ANUAL' as LeaveType);
      setReason('');
      setStartDate('');
      setEndDate('');
      setSuccessMessage('Votre demande de congé a été envoyée avec succès.');
      setTimeout(() => setSuccessMessage(''), 5000);
      await loadData();
    } catch (err: any) {
      setFormError(err.message || 'Impossible d\'envoyer la demande.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="leave-req-container">
      <div className="leave-req-header-row">
        <div>
          <h1 className="leave-req-title">Demande de congé</h1>
          <p className="leave-req-subtitle">Soumettez une demande et consultez votre historique de congés.</p>
        </div>
        <div className="leave-balance-badge">
          <Calendar size={15} color="#4F6BFE" />
          <span>Solde de congé annuel</span>
          <strong>{balance} jours</strong>
        </div>
      </div>

      <div className="leave-mid-row">
        <div className="leave-form-card">
          <p className="leave-form-title">Nouvelle demande</p>
          <p className="leave-form-subtitle">Votre responsable examinera cette demande.</p>

          {successMessage && <div className="modal-success" style={{ marginTop: 12 }}>{successMessage}</div>}
          {formError && <div className="modal-error" style={{ marginTop: 12 }}>{formError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="leave-form-grid">
              <div className="leave-form-group">
                <label>Type de congé</label>
                <select value={type} onChange={(e) => setType(e.target.value as LeaveType)}>
                  <option value="ANUAL">Congé annuel</option>
                  <option value="SICK">Congé maladie</option>
                  <option value="MATERNATY">Congé maternité</option>
                  <option value="PATERNITY">Congé paternité</option>
                  <option value="UNPAID">Congé sans solde</option>
                  <option value="SPECIAL">Speciel</option>
                </select>
              </div>
              <div className="leave-form-group">
                <label>Motif</label>
                <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Voyage personnel" required />
              </div>
              <div className="leave-form-group">
                <label>Date de début</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div className="leave-form-group">
                <label>Date de fin</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>

            <div className="leave-duration-box">
              <span className="left"><Calendar size={14} /> Durée estimée</span>
              <span className="right">{dayCount(startDate, endDate)} jours ouvrés</span>
            </div>

            <button type="submit" className="leave-submit-btn" disabled={submitting}>
              <Check size={16} /> {submitting ? 'Envoi...' : 'Envoyer la demande'}
            </button>
          </form>
        </div>

        <div className="leave-notification-card">
          <div className="leave-notif-icon"><ShieldCheck size={18} color="#93A4F8" /></div>
          <p className="leave-notif-label">Dernière notification</p>
          <p className="leave-notif-title">
            {myLeaves[0]
              ? `Votre demande de congé a été ${myLeaves[0].status === 'APPROVED' ? 'approuvée' : myLeaves[0].status === 'REJECTED' ? 'refusée' : 'soumise'}.`
              : 'Aucune notification récente.'}
          </p>
          {myLeaves[0] && (
            <p className="leave-notif-text">
              Votre congé {myLeaves[0].type} du <strong>{myLeaves[0].startDate}</strong> au <strong>{myLeaves[0].endDate}</strong> a été {myLeaves[0].status === 'APPROVED' ? 'approuvé' : myLeaves[0].status === 'REJECTED' ? 'refusé' : 'soumis'}.
            </p>
          )}
        </div>
      </div>

      <div className="leave-history-card">
        <p className="leave-history-title">Mes demandes précédentes</p>
        <p className="leave-history-subtitle">Historique de vos demandes de congé</p>
        <table className="leave-req-table">
          <thead><tr><th>Type de congé</th><th>Dates</th><th>Durée</th><th>Motif</th><th>Statut</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>Chargement...</td></tr>
            ) : myLeaves.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>Aucune demande pour le moment.</td></tr>
            ) : (
              myLeaves.map((l) => (
                <tr key={l.id}>
                  <td>{l.type}</td>
                  <td>{l.startDate} → {l.endDate}</td>
                  <td>{dayCount(l.startDate, l.endDate)} jours</td>
                  <td>{l.reason || '-'}</td>
                  <td><span className={`leave-status-badge ${l.status}`}>{l.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
