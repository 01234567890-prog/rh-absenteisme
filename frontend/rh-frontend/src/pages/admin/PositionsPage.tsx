import React, { useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '../../api/client';
import type { PositionResponseDto } from '../../types/api';
import './PositionsPage.css';

export const PositionsPage: React.FC = () => {
  const [positions, setPositions] = useState<PositionResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingPos, setEditingPos] = useState<PositionResponseDto | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const loadPositions = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await api.getPositions();
      setPositions(data);
    } catch (err: any) {
      console.error('Error loading positions:', err);
      setErrorMsg(err.message || 'Failed to load positions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPositions();
  }, []);

  const openCreateModal = () => {
    setTitle('');
    setDescription('');
    setIsCreateOpen(true);
  };

  const openEditModal = (pos: PositionResponseDto) => {
    setEditingPos(pos);
    setTitle(pos.title || '');
    setDescription(pos.description || '');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPosition({ title, description });
      setIsCreateOpen(false);
      loadPositions();
    } catch (err: any) {
      alert('Error creating position: ' + err.message);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPos) return;
    try {
      await api.updatePosition(editingPos.id, { title, description });
      setEditingPos(null);
      loadPositions();
    } catch (err: any) {
      alert('Error updating position: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this position?')) return;
    try {
      await api.deletePosition(id);
      loadPositions();
    } catch (err: any) {
      alert('Error deleting position: ' + err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Position Management</h1>
          <p className="page-subtitle">Manage job titles and role descriptions</p>
        </div>
        <button className="primary-btn" onClick={openCreateModal}>
          <Plus size={16} /> Add Position
        </button>
      </div>

      {errorMsg && (
        <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '8px' }}>
          {errorMsg}
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Position Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>
                  Loading positions...
                </td>
              </tr>
            ) : positions.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>
                  No positions found.
                </td>
              </tr>
            ) : (
              positions.map((pos) => (
                <tr key={pos.id}>
                  <td>{pos.id}</td>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>{pos.title}</td>
                  <td>{pos.description || '-'}</td>
                  <td>
                    <div className="action-btns">
                      <Tooltip title="Edit position">
                        <button
                          type="button"
                          className="action-icon-btn pencil-btn"
                          onClick={() => openEditModal(pos)}
                          aria-label={`Edit position ${pos.title}`}
                        >
                          <Pencil size={16} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete position">
                        <button
                          type="button"
                          className="action-icon-btn trash-btn"
                          onClick={() => handleDelete(pos.id)}
                          aria-label={`Delete position ${pos.title}`}
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
              <div className="modal-title">Create Position</div>
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
                <label>Position Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Software Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Job role responsibilities and requirements"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Create Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPos && (
        <div className="modal-overlay" onClick={() => setEditingPos(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Edit Position #{editingPos.id}</div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setEditingPos(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Position Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                <button type="button" className="cancel-btn" onClick={() => setEditingPos(null)}>
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
