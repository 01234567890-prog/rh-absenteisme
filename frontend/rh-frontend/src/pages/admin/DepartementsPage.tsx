import React, { useEffect, useState } from 'react';
import { Alert, Snackbar, Tooltip } from '@mui/material';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '../../api/client';
import type { DepartementResponseDto } from '../../types/api';
import './DepartementsPage.css';

export const DepartementsPage: React.FC = () => {
  const [departements, setDepartements] = useState<DepartementResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingDept, setEditingDept] = useState<DepartementResponseDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DepartementResponseDto | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [toast, setToast] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

  const loadDepartements = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await api.getDepartements();
      setDepartements(data);
    } catch (err: any) {
      console.error('Error loading departements:', err);
      const status = err.response?.status;
      setErrorMsg(status === 401 || status === 403
        ? `Department access denied (${status}). Please sign in again or contact an administrator.`
        : err.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartements();
  }, []);

  const openCreateModal = () => {
    setName('');
    setDescription('');
    setIsCreateOpen(true);
  };

  const openEditModal = (dept: DepartementResponseDto) => {
    setEditingDept(dept);
    setName(dept.name || '');
    setDescription(dept.description || '');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDepartement({ name, description });
      setIsCreateOpen(false);
      setToast({ severity: 'success', message: 'Department created successfully.' });
      loadDepartements();
    } catch (err: any) {
      setToast({ severity: 'error', message: 'Error creating department: ' + (err.message || 'unknown error') });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    try {
      await api.updateDepartement(editingDept.id, { name, description });
      setEditingDept(null);
      setToast({ severity: 'success', message: 'Department updated successfully.' });
      loadDepartements();
    } catch (err: any) {
      setToast({ severity: 'error', message: 'Error updating department: ' + (err.message || 'unknown error') });
    }
  };

  const requestDelete = (dept: DepartementResponseDto) => {
    setDeleteTarget(dept);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await api.deleteDepartement(deleteTarget.id);
      setToast({ severity: 'success', message: 'Department deleted successfully.' });
      setDeleteTarget(null);
      loadDepartements();
    } catch (err: any) {
      setToast({ severity: 'error', message: 'Error deleting department: ' + (err.message || 'unknown error') });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Department Management</h1>
          <p className="page-subtitle">Organize and maintain organizational departments</p>
        </div>
        <button className="primary-btn" onClick={openCreateModal}>
          <Plus size={16} /> Add Department
        </button>
      </div>

      {errorMsg && (
        <div className="page-error" role="alert">
          <span>{errorMsg}</span>
          <button onClick={loadDepartements}>Try again</button>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Department Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>
                  Loading departments...
                </td>
              </tr>
            ) : departements.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>
                  No departments found.
                </td>
              </tr>
            ) : (
              departements.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.id}</td>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>{dept.name}</td>
                  <td>{dept.description || '-'}</td>
                  <td>
                    <div className="action-btns">
                      <Tooltip title="Edit department">
                        <button
                          type="button"
                          className="action-icon-btn pencil-btn"
                          onClick={() => openEditModal(dept)}
                          aria-label={`Edit department ${dept.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete department">
                        <button
                          type="button"
                          className="action-icon-btn trash-btn"
                          onClick={() => requestDelete(dept)}
                          aria-label={`Delete department ${dept.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Create Department</div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsCreateOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label>Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Human Resources"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of department responsibilities"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingDept && (
        <div className="modal-overlay" onClick={() => setEditingDept(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Edit Department #{editingDept.id}</div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setEditingDept(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Department Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setEditingDept(null)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => (deletingId === null ? setDeleteTarget(null) : undefined)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Delete department?</div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setDeleteTarget(null)}
                disabled={deletingId !== null}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <Alert severity="warning" style={{ borderRadius: 10 }}>
              This will permanently remove "{deleteTarget.name}". This action cannot be undone.
            </Alert>
            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setDeleteTarget(null)}
                disabled={deletingId !== null}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-btn"
                onClick={handleDelete}
                disabled={deletingId !== null}
                style={{ backgroundColor: '#DC2626' }}
              >
                {deletingId !== null ? 'Deleting...' : 'Delete department'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast(null)}>
        {toast ? (
          <Alert severity={toast.severity} onClose={() => setToast(null)}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </div>
  );
};