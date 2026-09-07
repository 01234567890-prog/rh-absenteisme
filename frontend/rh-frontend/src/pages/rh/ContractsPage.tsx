import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../../api/client';
import type { ContratResponseDto, ContratType, ContratStatus, UserResponseDto } from '../../types/api';
import './ContractsPage.css';

interface ContractFormValues {
  userId?: number;
  type: ContratType;
  baseSalary: string;
  status: ContratStatus;
  signatureDate: string;
  startDate: string;
  endDate: string;
}

const emptyForm: ContractFormValues = {
  userId: undefined,
  type: 'CDI',
  baseSalary: '',
  status: 'ACTIVE',
  signatureDate: '',
  startDate: '',
  endDate: '',
};

export const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<ContratResponseDto[]>([]);
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<ContractFormValues>(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    const [contractsResult, usersResult] = await Promise.allSettled([
      api.getContrats(),
      api.getUsers(),
    ]);
    if (contractsResult.status === 'fulfilled') setContracts(contractsResult.value);
    else {
      const status = (contractsResult.reason as any)?.response?.status;
      setErrorMsg(status === 401 || status === 403 ? `Accès refusé (${status}).` : 'Impossible de charger les contrats.');
    }
    if (usersResult.status === 'fulfilled') setUsers(usersResult.value);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const userLabel = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : `#${userId}`;
  };

  const openModal = () => {
    setFormValues(emptyForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const setValue = <K extends keyof ContractFormValues>(key: K, value: ContractFormValues[K]) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.userId) {
      setFormError('Veuillez sélectionner un employé.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await api.createContrat({
        userId: formValues.userId,
        type: formValues.type,
        baseSalary: Number(formValues.baseSalary),
        status: formValues.status,
        signatureDate: formValues.signatureDate,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
      } as any);
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setFormError(err.message || 'Impossible de créer le contrat.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusClass = (status: ContratStatus) => {
    if (status === 'ACTIVE') return 'status-active';
    return 'status-expired';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">People Operations</p>
          <h1 className="page-title">Contracts</h1>
          <p className="page-subtitle">A chronological record of employee contracts.</p>
        </div>
        <button className="primary-btn" onClick={openModal}>+ Add contract</button>
      </div>

      {errorMsg && <div className="page-error" role="alert"><span>{errorMsg}</span><button onClick={loadData}>Réessayer</button></div>}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr><th>Employee</th><th>Type</th><th>Base salary</th><th>Start date</th><th>End date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="table-state">Chargement...</td></tr>
            ) : contracts.length === 0 ? (
              <tr><td colSpan={6} className="table-state">Contracts are added by HR staff to track employee agreements.</td></tr>
            ) : (
              contracts.map((c) => (
                <tr key={c.id}>
                  <td>{userLabel(c.userId)}</td>
                  <td>{c.type}</td>
                  <td>{c.baseSalary}</td>
                  <td>{c.startDate}</td>
                  <td>{c.endDate}</td>
                  <td><span className={`status-tag ${statusClass(c.status)}`}>{c.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-category">Historical record</div>
                <h2 className="modal-title">Add contract</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>

            {formError && <div className="modal-error">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee</label>
                  <select value={formValues.userId ?? ''} onChange={(e) => setValue('userId', e.target.value ? Number(e.target.value) : undefined)} required>
                    <option value="" disabled>Select employee</option>
                    {users.map((u) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={formValues.type} onChange={(e) => setValue('type', e.target.value as ContratType)}>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="INTERIM">INTERIM</option>
                    <option value="STAGE">STAGE</option>
                    <option value="ALTERNANCE">ALTERNANCE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Base salary</label>
                  <input type="number" value={formValues.baseSalary} onChange={(e) => setValue('baseSalary', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formValues.status} onChange={(e) => setValue('status', e.target.value as ContratStatus)}>
                    <option value="ACTIVE">Active</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="TERMINATED">Terminated</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Signature date</label>
                  <input type="date" value={formValues.signatureDate} onChange={(e) => setValue('signatureDate', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Start date</label>
                  <input type="date" value={formValues.startDate} onChange={(e) => setValue('startDate', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>End date</label>
                  <input type="date" value={formValues.endDate} onChange={(e) => setValue('endDate', e.target.value)} required />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Add contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};