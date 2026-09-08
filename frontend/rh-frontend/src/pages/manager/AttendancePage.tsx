import React, { useCallback, useEffect, useState } from 'react';
import { Search, UserCheck, UserX, Clock, CalendarCheck } from 'lucide-react';
import { api } from '../../api/client';
import { findCurrentManager, getTeamMembers } from './managerHelpers';
import type { PresenceResponseDto, UserResponseDto, DepartementResponseDto } from '../../types/api';
import './AttendancePage.css';

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const durationLabel = (checkIn?: string, checkOut?: string) => {
  if (!checkIn || !checkOut) return '-';
  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);
  const minutes = (outH * 60 + outM) - (inH * 60 + inM);
  if (minutes <= 0) return '-';
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

export const AttendancePage: React.FC = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [departements, setDepartements] = useState<DepartementResponseDto[]>([]);
  const [presences, setPresences] = useState<PresenceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const loadData = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled([api.getUsers(), api.getDepartements(), api.getPresences()]);
    const [usersR, deptR, presR] = results;
    if (usersR.status === 'fulfilled') setUsers(usersR.value);
    if (deptR.status === 'fulfilled') setDepartements(deptR.value);
    if (presR.status === 'fulfilled') setPresences(presR.value);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const currentManager = findCurrentManager(users);
  const team = getTeamMembers(users, currentManager?.id);
  const teamIds = new Set(team.map((u) => u.id));
  const dayPresences = presences.filter((p) => teamIds.has(p.userId) && p.date === selectedDate);

  const present = dayPresences.filter((p) => p.status === 'PRESENT').length;
  const absent = dayPresences.filter((p) => p.status === 'ABSENT').length;
  const late = dayPresences.filter((p) => p.status === 'LATE').length;
  const onLeave = dayPresences.filter((p) => p.status === 'ON_LEAVE').length;
  const attendanceRate = team.length ? Math.round(((present + late) / team.length) * 100) : 0;



  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | ''>('');
  const [manualAction, setManualAction] = useState<'in' | 'out' | null>(null);
  const [manualMessage, setManualMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);



  
  const filteredRows = dayPresences.filter((p) => {
    const u = users.find((user) => user.id === p.userId);
    const name = u ? `${u.firstName} ${u.lastName}`.toLowerCase() : '';
    return name.includes(search.toLowerCase());
  });

  const deptName = (id?: number) => departements.find((d) => d.id === id)?.name || '-';
  const statusClass = (status: string) => (status.toLowerCase() === 'on_leave' ? 'leave' : status.toLowerCase());

  const avgMinutes = (() => {
    const durations = dayPresences
      .filter((p) => p.checkInTime && p.checkOutTime)
      .map((p) => {
        const [inH, inM] = p.checkInTime!.split(':').map(Number);
        const [outH, outM] = p.checkOutTime!.split(':').map(Number);
        return outH * 60 + outM - (inH * 60 + inM);
      })
      .filter((m) => m > 0);
    return durations.length ? Math.round(durations.reduce((t, m) => t + m, 0) / durations.length) : 0;
  })();

  const handleManualCheckIn = async () => {
  if (!selectedEmployeeId) return;
  setManualAction('in');
  setManualMessage(null);
  try {
    await api.checkIn(selectedEmployeeId);
    setManualMessage({ type: 'success', text: 'Arrivée enregistrée avec succès.' });
    await loadData();
  } catch (err: any) {
    setManualMessage({ type: 'error', text: err.message || 'Impossible d\'enregistrer l\'arrivée.' });
  } finally {
    setManualAction(null);
  }
};

const handleManualCheckOut = async () => {
  if (!selectedEmployeeId) return;
  setManualAction('out');
  setManualMessage(null);
  try {
    await api.checkOut(selectedEmployeeId);
    setManualMessage({ type: 'success', text: 'Départ enregistré avec succès.' });
    await loadData();
  } catch (err: any) {
    setManualMessage({ type: 'error', text: err.message || 'Impossible d\'enregistrer le départ.' });
  } finally {
    setManualAction(null);
  }
};

  return (
    <div className="att-container">
      <div className="att-header-row">
        <div>
          <p className="att-eyebrow">Team Operations</p>
          <h1 className="att-title">Attendance management</h1>
          <p className="att-subtitle">Monitor today's presence and working hours for your team.</p>
        </div>
        <input type="date" className="att-date-input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      <div className="att-stats-grid">
        <div className="att-stat-card"><div className="att-stat-icon green"><UserCheck size={17} /></div><p className="att-stat-label">Present</p><p className="att-stat-value">{loading ? '...' : present}</p><p className="att-stat-note">{attendanceRate}% of team</p></div>
        <div className="att-stat-card"><div className="att-stat-icon orange"><UserX size={17} /></div><p className="att-stat-label">Absent</p><p className="att-stat-value">{loading ? '...' : absent}</p><p className="att-stat-note">Needs follow-up</p></div>
        <div className="att-stat-card"><div className="att-stat-icon purple"><Clock size={17} /></div><p className="att-stat-label">Late arrivals</p><p className="att-stat-value">{loading ? '...' : late}</p><p className="att-stat-note">Today</p></div>
        <div className="att-stat-card"><div className="att-stat-icon blue"><CalendarCheck size={17} /></div><p className="att-stat-label">On leave</p><p className="att-stat-value">{loading ? '...' : onLeave}</p><p className="att-stat-note">Approved leave</p></div>
      </div>

      <div className="att-mid-row">
        <div className="att-card">
          <div className="att-card-header-row">
            <div>
              <p className="att-card-title">Today's team attendance</p>
              <p className="att-card-subtitle">{new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="att-search"><Search size={14} color="#94A3B8" /><input placeholder="Search employee" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          </div>
          <table className="att-table">
            <thead><tr><th>Employee</th><th>Department</th><th>Check-in</th><th>Check-out</th><th>Duration</th><th>Status</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>Loading...</td></tr>
              ) : filteredRows.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>No records for this date.</td></tr>
              ) : (
                filteredRows.map((p) => {
                  const u = users.find((user) => user.id === p.userId);
                  return (
                    <tr key={p.id}>
                      <td><div className="att-employee-cell"><div className="att-avatar">{(u?.firstName?.[0] || '?')}{(u?.lastName?.[0] || '')}</div><span>{u ? `${u.firstName} ${u.lastName}` : `#${p.userId}`}</span></div></td>
                      <td>{deptName(u?.departementId)}</td>
                      <td>{p.checkInTime || '-'}</td>
                      <td>{p.checkOutTime || '-'}</td>
                      <td>{durationLabel(p.checkInTime, p.checkOutTime)}</td>
                      <td><span className={`att-status-dot ${statusClass(p.status)}`} />{p.status}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="att-manual-card">
  <p className="att-manual-title">Enregistrement manuel</p>
  <p className="att-manual-subtitle">Enregistrez l'arrivée ou le départ d'un employé de votre équipe.</p>
  <div className="att-manual-row">
    <div className="att-manual-field">
      <label>Employé</label>
      <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value ? Number(e.target.value) : '')}>
        <option value="">Sélectionner un employé</option>
        {team.map((u) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
      </select>
    </div>
    <button className="att-manual-btn in" disabled={!selectedEmployeeId || manualAction !== null} onClick={handleManualCheckIn}>
      {manualAction === 'in' ? '...' : 'Enregistrer arrivée'}
    </button>
    <button className="att-manual-btn out" disabled={!selectedEmployeeId || manualAction !== null} onClick={handleManualCheckOut}>
      {manualAction === 'out' ? '...' : 'Enregistrer départ'}
    </button>
  </div>
  {manualMessage && <div className={`att-manual-msg ${manualMessage.type}`}>{manualMessage.text}</div>}
</div>

        <div className="att-card">
          <p className="att-card-title">Working hours</p>
          <p className="att-card-subtitle">Today's average</p>
          <p className="att-hours-value">{Math.floor(avgMinutes / 60)}h {avgMinutes % 60}m</p>
          <p className="att-hours-label">Average time worked</p>
          <div className="att-bars-row">
            {dayLabels.map((day, idx) => (
              <div className="att-bar-col" key={day}>
                <div className={`att-bar ${idx === new Date(selectedDate).getDay() - 1 ? 'active' : ''}`} style={{ height: `${40 + idx * 8}%` }} />
                <span className="att-bar-label">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};