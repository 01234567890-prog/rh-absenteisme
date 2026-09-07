import React, { useCallback, useEffect, useState } from 'react';
import { BarChart3, Users, UserCheck, UserX, CalendarClock, TrendingUp } from 'lucide-react';
import { api } from '../../api/client';
import { findCurrentManager, getTeamMembers } from './managerHelpers';
import { calculateManagerMetrics } from './managerMetrics';
import type { DepartementResponseDto, EvaluationResponseDto, LeaveResponseDto, PresenceResponseDto, UserResponseDto } from '../../types/api';
import './ManagerDashboard.css';

export const ManagerDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [departements, setDepartements] = useState<DepartementResponseDto[]>([]);
  const [presences, setPresences] = useState<PresenceResponseDto[]>([]);
  const [leaves, setLeaves] = useState<LeaveResponseDto[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled([
      api.getUsers(),
      api.getDepartements(),
      api.getPresences(),
      api.getLeaves(),
      api.getEvaluations(),
    ]);
    const [usersR, deptR, presR, leavesR, evalR] = results;
    if (usersR.status === 'fulfilled') setUsers(usersR.value);
    if (deptR.status === 'fulfilled') setDepartements(deptR.value);
    if (presR.status === 'fulfilled') setPresences(presR.value);
    if (leavesR.status === 'fulfilled') setLeaves(leavesR.value);
    if (evalR.status === 'fulfilled') setEvaluations(evalR.value);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const currentManager = findCurrentManager(users);
  const team = getTeamMembers(users, currentManager?.id);
  const today = new Date().toISOString().slice(0, 10);
  const presencesToday = presences.filter((p) => p.date === today);
  const metrics = calculateManagerMetrics(team, presencesToday, leaves, evaluations);

  const deptStats = departements
    .map((dept) => {
      const deptTeam = team.filter((u) => u.departementId === dept.id);
      const deptPresent = presencesToday.filter((p) => deptTeam.some((u) => u.id === p.userId) && (p.status === 'PRESENT' || p.status === 'LATE')).length;
      const rate = deptTeam.length ? Math.round((deptPresent / deptTeam.length) * 100) : 0;
      return { name: dept.name, count: deptTeam.length, rate };
    })
    .filter((d) => d.count > 0);

  const firstName = currentManager?.firstName || 'Manager';

  return (
    <div className="mgr-container">
      <div className="mgr-header-row">
        <div>
          <h1 className="mgr-title">Good morning, {firstName}</h1>
          <p className="mgr-subtitle">Here is the latest overview of your team's activity.</p>
        </div>
        <button className="mgr-report-btn"><BarChart3 size={16} /> View team report</button>
      </div>

      <div className="mgr-stats-grid">
        <div className="mgr-stat-card">
          <div className="mgr-stat-icon blue"><Users size={17} /></div>
          <p className="mgr-stat-label">Total employees</p>
          <p className="mgr-stat-value">{loading ? '...' : metrics.totalEmployees}</p>
          <p className="mgr-stat-note">Across {deptStats.length} departments</p>
        </div>
        <div className="mgr-stat-card">
          <div className="mgr-stat-icon green"><UserCheck size={17} /></div>
          <p className="mgr-stat-label">Present today</p>
          <p className="mgr-stat-value">{loading ? '...' : metrics.presentToday}</p>
          <p className="mgr-stat-note">{metrics.attendanceRate}% of your team</p>
        </div>
        <div className="mgr-stat-card">
          <div className="mgr-stat-icon orange"><UserX size={17} /></div>
          <p className="mgr-stat-label">Absent today</p>
          <p className="mgr-stat-value">{loading ? '...' : metrics.absentToday}</p>
        </div>
        <div className="mgr-stat-card">
          <div className="mgr-stat-icon purple"><CalendarClock size={17} /></div>
          <p className="mgr-stat-label">Pending leave requests</p>
          <p className="mgr-stat-value">{loading ? '...' : metrics.pendingLeaves}</p>
          <p className="mgr-stat-note">Requires your review</p>
        </div>
        <div className="mgr-stat-card">
          <div className="mgr-stat-icon blue"><TrendingUp size={17} /></div>
          <p className="mgr-stat-label">Average evaluation</p>
          <p className="mgr-stat-value">{loading ? '...' : metrics.avgEvaluationScore === null ? 'N/A' : `${Math.round(metrics.avgEvaluationScore)}%`}</p>
        </div>
        <div className="mgr-stat-card">
          <div className="mgr-stat-icon green"><UserCheck size={17} /></div>
          <p className="mgr-stat-label">Attendance rate</p>
          <p className="mgr-stat-value">{loading ? '...' : `${metrics.attendanceRate}%`}</p>
        </div>
      </div>

      <div className="mgr-mid-row">
        <div className="mgr-card">
          <p className="mgr-card-title">Team attendance</p>
          <p className="mgr-card-subtitle">Today's attendance overview</p>
          <div className="mgr-donut-row">
            <div className="mgr-legend">
              <div className="mgr-legend-item"><span className="mgr-legend-dot" style={{ background: '#16A34A' }} />{metrics.presentToday} Present</div>
              <div className="mgr-legend-item"><span className="mgr-legend-dot" style={{ background: '#EA580C' }} />{metrics.absentToday} Absent</div>
              <div className="mgr-legend-item"><span className="mgr-legend-dot" style={{ background: '#7C3AED' }} />{metrics.onLeaveToday} On leave</div>
            </div>
          </div>
        </div>

        <div className="mgr-card">
          <p className="mgr-card-title">Department statistics</p>
          <p className="mgr-card-subtitle">Headcount and attendance rate</p>
          <div className="mgr-dept-list">
            {deptStats.length === 0 ? <p className="mgr-card-subtitle">No department data.</p> : deptStats.map((d) => (
              <div className="mgr-dept-row" key={d.name}>
                <span className="mgr-dept-name"><span className="mgr-dept-dot" style={{ background: '#4F6BFE' }} />{d.name}</span>
                <span><span className="mgr-dept-count">{d.count}</span><span className="mgr-dept-rate">{d.rate}%</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};