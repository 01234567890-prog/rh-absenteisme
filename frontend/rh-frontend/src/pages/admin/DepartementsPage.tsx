import React, { useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';
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

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

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
      loadDepartements();
    } catch (err: any) {
      alert('Error creating department: ' + err.message);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    try {
      await api.updateDepartement(editingDept.id, { name, description });
      setEditingDept(null);
      loadDepartements();
    } catch (err: any) {
      alert('Error updating department: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await api.deleteDepartement(id);
      loadDepartements();
    } catch (err: any) {
      alert('Error deleting department: ' + err.message);
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
                  <td>#{dept.id}</td>
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
                          onClick={() => handleDelete(dept.id)}
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
    </div>
  );
};
