import React, { useCallback, useEffect, useState } from 'react';
import { Download, Phone, Mail } from 'lucide-react';
import { api } from '../../api/client';
import { findCurrentEmployee } from './employeeHelpers';
import type { DepartementResponseDto, EvaluationResponseDto, PositionResponseDto, UserResponseDto } from '../../types/api';
import './ProfilePage.css';

const RingScore: React.FC<{ score: number }> = ({ score }) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="emp-ring-wrap" style={{ width: 64, height: 64 }}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#EEF0F4" strokeWidth="6" />
        <circle
          cx="32" cy="32" r={radius} fill="none" stroke="#4F6BFE" strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
      </svg>
      <div className="emp-ring-value">{score}%</div>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [departements, setDepartements] = useState<DepartementResponseDto[]>([]);
  const [positions, setPositions] = useState<PositionResponseDto[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled([
      api.getUsers(), api.getDepartements(), api.getPositions(), api.getEvaluations(),
    ]);
    const [usersR, deptR, posR, evalR] = results;
    if (usersR.status === 'fulfilled') setUsers(usersR.value);
    if (deptR.status === 'fulfilled') setDepartements(deptR.value);
    if (posR.status === 'fulfilled') setPositions(posR.value);
    if (evalR.status === 'fulfilled') setEvaluations(evalR.value);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const me = findCurrentEmployee(users);
  const myEvaluations = evaluations
    .filter((e) => e.evaluatedUserId === me?.id && e.confirmed)
    .sort((a, b) => (a.evaluationDate < b.evaluationDate ? 1 : -1));

  const deptName = departements.find((d) => d.id === me?.departementId)?.name || '-';
  const posTitle = positions.find((p) => p.id === me?.positionId)?.title || '-';
  const globalScore = myEvaluations.length
    ? Math.round(myEvaluations.reduce((t, e) => t + (e.performanceScore + e.competencyScore + e.behaviorScore) / 3, 0) / myEvaluations.length)
    : 0;

  if (loading || !me) {
    return <div className="emp-profile-container"><p>Chargement du profil...</p></div>;
  }

  return (
    <div className="emp-profile-container">
      <div className="emp-profile-header-row">
        <div>
          <h1 className="emp-profile-title">Mon profil</h1>
          <p className="emp-profile-subtitle">Retrouvez vos informations professionnelles et votre historique de performance.</p>
        </div>
        <button className="emp-download-btn"><Download size={15} /> Télécharger le profil</button>
      </div>

      <div className="emp-info-card">
        <div className="emp-identity-row">
          <div className="emp-avatar-lg">{me.firstName[0]}{me.lastName[0]}</div>
          <div>
            <div className="emp-name-row">
              <span className="emp-name">{me.firstName} {me.lastName}</span>
              <span className="emp-active-badge">● {me.status === 'ACTIVE' ? 'Actif' : me.status}</span>
            </div>
            <p className="emp-title-line">{posTitle} · Département {deptName}</p>
            <div className="emp-contact-row">
              <span><Mail size={13} /> {me.email}</span>
              <span><Phone size={13} /> {me.phoneNumber || '-'}</span>
            </div>
          </div>
        </div>
        <div className="emp-meta-grid">
          <div><p className="emp-meta-label">Téléphone</p><p className="emp-meta-value">{me.phoneNumber || '-'}</p></div>
          <div><p className="emp-meta-label">Date d'embauche</p><p className="emp-meta-value">{me.hireDate}</p></div>
          <div><p className="emp-meta-label">Département</p><p className="emp-meta-value">{deptName}</p></div>
          <div><p className="emp-meta-label">Rôle</p><p className="emp-meta-value">Employé</p></div>
        </div>
      </div>

      <div className="emp-summary-card">
        <div className="emp-summary-left">
          <div className="emp-summary-icon"><Download size={17} /></div>
          <div>
            <p className="emp-summary-label">Résumé professionnel</p>
            <p className="emp-summary-title">Un collaborateur engagé dans l'innovation digitale</p>
            <p className="emp-summary-text">{me.firstName} contribue activement aux projets de son équipe avec une expertise solide dans son domaine.</p>
          </div>
        </div>
        <div className="emp-summary-score">{globalScore}%<span>Score global</span></div>
      </div>

      <div>
        <div className="emp-eval-history-header">
          <div>
            <p className="emp-eval-history-title">Historique des évaluations</p>
            <p className="emp-eval-history-subtitle">Vos évaluations trimestrielles et l'atteinte de vos objectifs.</p>
          </div>
          <span className="emp-year-badge">2026</span>
        </div>

        <div className="emp-eval-grid" style={{ marginTop: 16 }}>
          {myEvaluations.length === 0 ? (
            <p style={{ color: '#8994a6', fontSize: 13 }}>Aucune évaluation confirmée pour le moment.</p>
          ) : (
            myEvaluations.map((ev) => {
              const overall = Math.round((ev.performanceScore + ev.competencyScore + ev.behaviorScore) / 3);
              const label = overall >= 85 ? 'Excellente performance' : overall >= 70 ? 'Très bonne performance' : 'Performance correcte';
              return (
                <div className="emp-eval-card" key={ev.id}>
                  <div style={{ flex: 1 }}>
                    <p className="emp-eval-period">{ev.period}</p>
                    <p className="emp-eval-label">{label}</p>
                    <p className="emp-eval-status">✓ Évaluation confirmée</p>
                    <div className="emp-eval-bar-row">
                      <span className="emp-eval-bar-label">Performance</span>
                      <div className="emp-eval-bar-track"><div className="emp-eval-bar-fill" style={{ width: `${ev.performanceScore}%` }} /></div>
                      <span className="emp-eval-bar-value">{ev.performanceScore}%</span>
                    </div>
                  </div>
                  <RingScore score={overall} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};