import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { api } from '../../api/client';
import type { LeaveResponseDto, LeaveStatus, UserResponseDto } from '../../types/api';
import './LeavesPage.css';

export const LeavesPage: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveResponseDto[]>([]);
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'ALL'>('ALL');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    const [leavesResult, usersResult] = await Promise.allSettled([
      api.getLeaves(),
      api.getUsers(),
    ]);
    if (leavesResult.status === 'fulfilled') setLeaves(leavesResult.value);
    else {
      const status = (leavesResult.reason as any)?.response?.status;
      setErrorMsg(status === 401 || status === 403 ? `Accès refusé (${status}).` : 'Impossible de charger les congés.');
    }
    if (usersResult.status === 'fulfilled') setUsers(usersResult.value);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const userLabel = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : `#${userId}`;
  };

  const filteredLeaves = statusFilter === 'ALL' ? leaves : leaves.filter((l) => l.status === statusFilter);

  const handleDecision = async (leave: LeaveResponseDto, decision: LeaveStatus) => {
    setProcessingId(leave.id);
    try {
      await api.updateLeaveStatus(leave.id, decision);
      await loadData();
    } catch (err: any) {
      alert('Erreur : ' + (err.message || 'impossible de traiter la demande.'));
    } finally {
      setProcessingId(null);
    }
  };

  const statusClass = (status: LeaveStatus) => {
    if (status === 'APPROVED') return 'status-approved';
    if (status === 'REJECTED') return 'status-rejected';
    return 'status-pending';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">People Operations</p>
          <h1 className="page-title">Leave requests</h1>
          <p className="page-subtitle">Review and respond to employee leave requests.</p>
        </div>
        <div className="header-icon-box"><Calendar size={20} /></div>
      </div>

      <div className="filter-row">
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as LeaveStatus | 'ALL')}>
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <span className="results-count">{filteredLeaves.length} requests</span>
      </div>

      {errorMsg && <div className="page-error" role="alert"><span>{errorMsg}</span><button onClick={loadData}>Réessayer</button></div>}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr><th>Employee</th><th>Type</th><th>Dates</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="table-state">Chargement...</td></tr>
            ) : filteredLeaves.length === 0 ? (
              <tr><td colSpan={6} className="table-state">No leave requests match this filter.</td></tr>
            ) : (
              filteredLeaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{userLabel(leave.userId)}</td>
                  <td>{leave.type}</td>
                  <td>{leave.startDate} → {leave.endDate}</td>
                  <td>{leave.reason || '-'}</td>
                  <td><span className={`status-tag ${statusClass(leave.status)}`}>{leave.status}</span></td>
                  <td>
                    {leave.status === 'PENDING' ? (
                      <div className="action-btns">
                        <button className="approve-btn" disabled={processingId === leave.id} onClick={() => handleDecision(leave, 'APPROVED')}>Approve</button>
                        <button className="reject-btn" disabled={processingId === leave.id} onClick={() => handleDecision(leave, 'REJECTED')}>Reject</button>
                      </div>
                    ) : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};