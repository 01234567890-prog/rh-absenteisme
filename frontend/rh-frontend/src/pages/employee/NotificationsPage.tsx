import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle, Bell, FileText } from 'lucide-react';
import { api } from '../../api/client';
import { findCurrentEmployee } from './employeeHelpers';
import type { EvaluationResponseDto, LeaveResponseDto, UserResponseDto } from '../../types/api';
import './NotificationsPage.css';

interface NotificationItem {
  id: string;
  type: 'approved' | 'rejected' | 'eval';
  title: string;
  text: string;
  time: string;
  isNew: boolean;
}

export const NotificationsPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [leaves, setLeaves] = useState<LeaveResponseDto[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled([api.getUsers(), api.getLeaves(), api.getEvaluations()]);
    const [usersR, leavesR, evalR] = results;
    if (usersR.status === 'fulfilled') setUsers(usersR.value);
    if (leavesR.status === 'fulfilled') setLeaves(leavesR.value);
    if (evalR.status === 'fulfilled') setEvaluations(evalR.value);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const me = findCurrentEmployee(users);
  const myLeaves = leaves.filter((l) => l.userId === me?.id && l.status !== 'PENDING');
  const myEvaluations = evaluations.filter((e) => e.evaluatedUserId === me?.id && e.confirmed);

  const notifications: NotificationItem[] = [
    ...myLeaves.map((l) => ({
      id: `leave-${l.id}`,
      type: (l.status === 'APPROVED' ? 'approved' : 'rejected') as 'approved' | 'rejected',
      title: `Votre demande de congé a été ${l.status === 'APPROVED' ? 'approuvée' : 'refusée'}`,
      text: `Votre congé ${l.type} du ${l.startDate} au ${l.endDate}.`,
      time: l.startDate,
      isNew: l.status === 'APPROVED',
    })),
    ...myEvaluations.map((e) => ({
      id: `eval-${e.id}`,
      type: 'eval' as const,
      title: 'Une nouvelle évaluation est disponible',
      text: `Votre évaluation de performance (${e.period}) est prête à être consultée.`,
      time: e.evaluationDate,
      isNew: true,
    })),
  ].sort((a, b) => (a.time < b.time ? 1 : -1));

  const unreadCount = notifications.filter((n) => n.isNew).length;

  const iconFor = (type: NotificationItem['type']) => {
    if (type === 'approved') return <CheckCircle size={17} />;
    if (type === 'rejected') return <Bell size={17} />;
    return <FileText size={17} />;
  };

  return (
    <div className="notif-container">
      <div className="notif-header-row">
        <div>
          <h1 className="notif-title">Notifications</h1>
          <p className="notif-subtitle">Retrouvez les informations importantes concernant votre vie professionnelle.</p>
        </div>
        <span className="notif-unread-badge">{unreadCount} non lues</span>
      </div>

      <div className="notif-card">
        <div className="notif-card-header">
          <div>
            <p className="notif-card-title">Centre de notifications</p>
            <p className="notif-card-subtitle">Vos dernières demandes, évaluations et rappels.</p>
          </div>
          <button className="notif-mark-all">Tout marquer comme lu</button>
        </div>

        <div className="notif-list">
          {loading ? (
            <p style={{ padding: 20, color: '#8994a6' }}>Chargement...</p>
          ) : notifications.length === 0 ? (
            <p style={{ padding: 20, color: '#8994a6' }}>Aucune notification pour le moment.</p>
          ) : (
            notifications.map((n) => (
              <div className="notif-row" key={n.id}>
                <div className={`notif-icon ${n.type}`}>{iconFor(n.type)}</div>
                <div className="notif-body">
                  <div className="notif-title-row">
                    <strong>{n.title}</strong>
                    {n.isNew && <span className="notif-new-badge">Nouveau</span>}
                  </div>
                  <p>{n.text}</p>
                  <p className="notif-time">{n.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};