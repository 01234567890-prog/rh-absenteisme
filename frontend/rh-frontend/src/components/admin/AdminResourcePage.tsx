import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import type {
  ContratResponseDto,
  EvaluationResponseDto,
  LeaveResponseDto,
  PresenceResponseDto,
  UserResponseDto,
} from '../../types/api';
import './AdminResourcePage.css';

type ResourceName = 'contracts' | 'leaves' | 'presences' | 'evaluations';
type ResourceRow = ContratResponseDto | LeaveResponseDto | PresenceResponseDto | EvaluationResponseDto;

interface AdminResourcePageProps {
  resource: ResourceName;
  title: string;
  subtitle: string;
}

const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString() : '-';
const displayValue = (value?: string | number | boolean) => value === undefined || value === null ? '-' : String(value);

export const AdminResourcePage: React.FC<AdminResourcePageProps> = ({ resource, title, subtitle }) => {
  const [rows, setRows] = useState<ResourceRow[]>([]);
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [resourceResult, usersResult] = await Promise.allSettled([
        resource === 'contracts'
          ? api.getContrats()
          : resource === 'leaves'
            ? api.getLeaves()
            : resource === 'presences'
              ? api.getPresences()
              : api.getEvaluations(),
        api.getUsers(),
      ]);
      if (resourceResult.status === 'rejected') throw resourceResult.reason;
      setRows(resourceResult.value as ResourceRow[]);
      if (usersResult.status === 'fulfilled') setUsers(usersResult.value);
      else console.error('User lookup data unavailable:', usersResult.reason);
    } catch (error: any) {
      console.error(`Error loading ${resource}:`, error);
      const status = error.response?.status;
      setErrorMsg(status === 401 || status === 403
        ? `Access denied (${status}). This area is read-only and requires permission from the backend.`
        : error.message || `Unable to load ${title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [resource, title]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const userName = (userId: number) => {
    const user = users.find((item) => item.id === userId);
    return user ? `${user.firstName} ${user.lastName}`.trim() : `User #${userId}`;
  };

  const renderRows = () => {
    if (resource === 'contracts') {
      return (rows as ContratResponseDto[]).map((contract) => (
        <tr key={contract.id}>
          <td>{userName(contract.userId)}</td>
          <td>{contract.type}</td>
          <td>{formatDate(contract.startDate)}</td>
          <td>{formatDate(contract.endDate)}</td>
          <td><span className="resource-status">{contract.status}</span></td>
        </tr>
      ));
    }
    if (resource === 'leaves') {
      return (rows as LeaveResponseDto[]).map((leave) => (
        <tr key={leave.id}>
          <td>{userName(leave.userId)}</td>
          <td>{leave.type}</td>
          <td>{formatDate(leave.startDate)}</td>
          <td>{formatDate(leave.endDate)}</td>
          <td><span className="resource-status">{leave.status}</span></td>
        </tr>
      ));
    }
    if (resource === 'presences') {
      return (rows as PresenceResponseDto[]).map((presence) => (
        <tr key={presence.id}>
          <td>{userName(presence.userId)}</td>
          <td>{formatDate(presence.date)}</td>
          <td>{displayValue(presence.checkInTime)}</td>
          <td>{displayValue(presence.checkOutTime)}</td>
          <td><span className="resource-status">{presence.status}</span></td>
        </tr>
      ));
    }
    return (rows as EvaluationResponseDto[]).map((evaluation) => {
      const scores = [evaluation.performanceScore, evaluation.competencyScore, evaluation.behaviorScore];
      const average = scores.every((score) => typeof score === 'number')
        ? (scores.reduce((total, score) => total + score, 0) / scores.length).toFixed(1)
        : '-';
      return (
        <tr key={evaluation.id}>
          <td>{userName(evaluation.evaluatedUserId)}</td>
          <td>{evaluation.period}</td>
          <td>{average}</td>
          <td>{formatDate(evaluation.evaluationDate)}</td>
          <td><span className="resource-status">{evaluation.confirmed ? 'CONFIRMED' : 'DRAFT'}</span></td>
        </tr>
      );
    });
  };

  const headers = {
    contracts: ['Employee', 'Type', 'Start date', 'End date', 'Status'],
    leaves: ['Employee', 'Type', 'Start date', 'End date', 'Status'],
    presences: ['Employee', 'Date', 'Check in', 'Check out', 'Status'],
    evaluations: ['Employee', 'Period', 'Average score', 'Evaluation date', 'State'],
  }[resource];

  return (
    <section className="resource-page">
      <div className="resource-page-header">
        <div>
          <p className="eyebrow">Read-only overview</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <button className="resource-refresh" onClick={loadData} disabled={loading}>
          <RefreshCw size={15} style={{ marginRight: 6 }} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {errorMsg && (
        <div className="resource-error" role="alert">
          <span>{errorMsg}</span>
          <button onClick={loadData}>Try again</button>
        </div>
      )}
      <div className="resource-card">
        <div className="resource-card-meta">
          <strong>{loading ? '...' : rows.length}</strong>
          <span>records available</span>
        </div>
        <div className="resource-table-wrap">
          <table className="resource-table">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={headers.length} className="resource-state">
                    Loading {title.toLowerCase()}...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="resource-state">
                    No {title.toLowerCase()} records found.
                  </td>
                </tr>
              ) : (
                renderRows()
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
