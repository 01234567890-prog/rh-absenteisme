import React, { useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '../../api/client';
import type { PositionResponseDto } from '../../types/api';
import './PositionsPage.css';

interface ErrorModalState {
  isOpen: boolean;
  message: string;
  action: 'create' | 'edit' | 'delete' | null;
}

interface DeleteConfirmState {
  isOpen: boolean;
  positionId: number | null;
  positionTitle: string;
}

export const PositionsPage: React.FC = () => {
  const [positions, setPositions] = useState<PositionResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingPos, setEditingPos] = useState<PositionResponseDto | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [errorModal, setErrorModal] = useState<ErrorModalState>({
    isOpen: false,
    message: '',
    action: null,
  });

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    isOpen: false,
    positionId: null,
    positionTitle: '',
  });

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

  const closeErrorModal = () => {
    setErrorModal({
      isOpen: false,
      message: '',
      action: null,
    });
  };

  const openDeleteConfirm = (id: number, title: string) => {
    setDeleteConfirm({
      isOpen: true,
      positionId: id,
      positionTitle: title,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      positionId: null,
      positionTitle: '',
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPosition({ title, description });
      setIsCreateOpen(false);
      loadPositions();
    } catch (err: any) {
      setErrorModal({
        isOpen: true,
        message: 'Error creating position: ' + err.message,
        action: 'create',
      });
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
      setErrorModal({
        isOpen: true,
        message: 'Error updating position: ' + err.message,
        action: 'edit',
      });
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirm.positionId) return;
    try {
      await api.deletePosition(deleteConfirm.positionId);
      closeDeleteConfirm();
      loadPositions();
    } catch (err: any) {
      setErrorModal({
        isOpen: true,
        message: 'Error deleting position: ' + err.message,
        action: 'delete',
      });
      closeDeleteConfirm();
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
                          onClick={() => openDeleteConfirm(pos.id, pos.title)}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="modal-overlay" onClick={closeDeleteConfirm}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ color: '#DC2626' }}>⚠️ Delete Position</div>
              <button
                type="button"
                className="close-btn"
                onClick={closeDeleteConfirm}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '16px', color: '#555', lineHeight: '1.6' }}>
              Are you sure you want to delete <strong>"{deleteConfirm.positionTitle}"</strong>? This action cannot be undone.
            </div>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={closeDeleteConfirm}>
                Cancel
              </button>
              <button
                type="button"
                className="primary-btn"
                onClick={handleDeleteConfirmed}
                style={{ backgroundColor: '#DC2626' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.isOpen && (
        <div className="modal-overlay" onClick={closeErrorModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ color: '#DC2626' }}>❌ Error</div>
              <button
                type="button"
                className="close-btn"
                onClick={closeErrorModal}
                aria-label="Close error modal"
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '16px', color: '#555', lineHeight: '1.6' }}>
              {errorModal.message}
            </div>
            <div className="modal-actions">
              <button type="button" className="primary-btn" onClick={closeErrorModal}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
