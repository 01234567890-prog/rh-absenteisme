import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { Check, ChevronDown, Shield } from 'lucide-react';
import { api } from '../../api/client';
import { useAdminRefresh } from '../../components/admin/AdminRefreshContext';
import type { RoleResponseDto, UserResponseDto } from '../../types/api';
import './RolesPage.css';

const userLabel = (user: UserResponseDto) =>
  `${user.firstName} ${user.lastName} (${user.email})`;

export const RolesPage: React.FC = () => {
  const { register } = useAdminRefresh();
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [selectedRoleId, setSelectedRoleId] = useState<number | ''>('');
  const [openMenu, setOpenMenu] = useState<'user' | 'role' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    const [usersResult, rolesResult] = await Promise.allSettled([
      api.getUsers(),
      api.getRoles(),
    ]);

    if (usersResult.status === 'fulfilled') {
      setUsers(usersResult.value);
    } else {
      console.error('Error fetching users for roles page:', usersResult.reason);
      const status = usersResult.reason?.response?.status;
      setErrorMsg(
        status === 401 || status === 403
          ? `User directory access denied (${status}). Please sign in again or contact an administrator.`
          : usersResult.reason?.message || 'Failed to load users'
      );
    }

    if (rolesResult.status === 'fulfilled') {
      setRoles(rolesResult.value);
    } else if (usersResult.status === 'fulfilled') {
      console.error('Error fetching roles:', rolesResult.reason);
      setErrorMsg('Users loaded, but role options are unavailable.');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => register(loadData, loading), [register, loadData, loading]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId),
    [users, selectedUserId]
  );
  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId),
    [roles, selectedRoleId]
  );

  const selectUser = (userId: number) => {
    const user = users.find((entry) => entry.id === userId);
    setSelectedUserId(userId);
    setSelectedRoleId(user?.roleId ?? '');
    setOpenMenu(null);
    setErrorMsg('');
  };

  const selectRole = (roleId: number | '') => {
    setSelectedRoleId(roleId);
    setOpenMenu(null);
  };

  const errorMessage = (error: unknown, fallback: string) => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const response = (error as { response?: { status?: number; data?: { message?: string } } }).response;
      if (response?.data?.message) return response.data.message;
      if (response?.status === 400) return 'The request is invalid. Check the selected user and role.';
      if (response?.status === 401) return 'Your session is no longer authorized. Please sign in again.';
      if (response?.status === 403) return 'You are not authorized to change this role.';
      if (response?.status === 404) return 'The user or role no longer exists.';
      if (response?.status === 409) return 'This role cannot be changed because it conflicts with existing data.';
    }
    return error instanceof Error ? error.message : fallback;
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUser || selectedRoleId === '') {
      setErrorMsg('Select a user and a role before saving.');
      return;
    }

    const currentEmail = localStorage.getItem('email');
    const currentRole = localStorage.getItem('role');
    const nextRoleName = roles.find((role) => role.id === selectedRoleId)?.name;
    if (
      currentEmail &&
      selectedUser.email.toLowerCase() === currentEmail.toLowerCase() &&
      currentRole === 'ADMIN' &&
      nextRoleName !== 'ADMIN'
    ) {
      setErrorMsg('You cannot remove your own ADMIN access from this page.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.updateUser(selectedUser.id, {
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        phoneNumber: selectedUser.phoneNumber || '',
        status: selectedUser.status || 'ACTIVE',
        departementId: selectedUser.departementId,
        roleId: selectedRoleId,
        positionId: selectedUser.positionId,
        managerId: selectedUser.managerId,
      });
      setSuccessMessage(`Role updated for ${userLabel(selectedUser)}.`);
      await loadData();
    } catch (error: unknown) {
      setErrorMsg(errorMessage(error, 'Unable to save the assigned role.'));
    } finally {
      setSubmitting(false);
    }
  };

  const saveDisabled =
    loading ||
    submitting ||
    !selectedUser ||
    selectedRoleId === '' ||
    selectedUser.roleId === selectedRoleId;

  return (
    <div className="roles-page">
      <div className="roles-page-header">
        <div>
          <p className="roles-eyebrow">ADMINISTRATION</p>
          <h1 className="roles-title">Role management</h1>
          <p className="roles-subtitle">Change the role assigned to an existing user.</p>
        </div>
        <div className="roles-header-icon" aria-hidden="true">
          <Shield size={28} strokeWidth={1.75} />
        </div>
      </div>

      {errorMsg && (
        <div className="page-error" role="alert">
          <span>{errorMsg}</span>
          <button type="button" onClick={loadData}>Try again</button>
        </div>
      )}

      <form className="roles-card" onSubmit={handleSave} ref={formRef}>
        <div className="roles-field">
          <label htmlFor="roles-user-trigger">User</label>
          <div className="roles-select">
            <button
              id="roles-user-trigger"
              type="button"
              className="roles-select-trigger"
              aria-haspopup="listbox"
              aria-expanded={openMenu === 'user'}
              disabled={loading || users.length === 0}
              onClick={() => setOpenMenu((current) => (current === 'user' ? null : 'user'))}
            >
              <span className={selectedUser ? '' : 'roles-placeholder'}>
                {loading ? 'Loading users...' : selectedUser ? userLabel(selectedUser) : 'Select a user'}
              </span>
              <ChevronDown size={16} />
            </button>
            {openMenu === 'user' && (
              <ul className="roles-select-menu" role="listbox" aria-labelledby="roles-user-trigger">
                {users.length === 0 ? (
                  <li className="roles-select-empty">No users found.</li>
                ) : (
                  users.map((user) => (
                    <li key={user.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={user.id === selectedUserId}
                        className={user.id === selectedUserId ? 'is-selected' : ''}
                        onClick={() => selectUser(user.id)}
                      >
                        {userLabel(user)}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="roles-field">
          <label htmlFor="roles-role-trigger">Role</label>
          <div className="roles-select">
            <button
              id="roles-role-trigger"
              type="button"
              className="roles-select-trigger"
              aria-haspopup="listbox"
              aria-expanded={openMenu === 'role'}
              disabled={loading || !selectedUser || roles.length === 0}
              onClick={() => setOpenMenu((current) => (current === 'role' ? null : 'role'))}
            >
              <span className={selectedRole ? '' : 'roles-placeholder'}>
                {selectedRole ? selectedRole.name : 'Select a role'}
              </span>
              <ChevronDown size={16} />
            </button>
            {openMenu === 'role' && (
              <ul className="roles-select-menu" role="listbox" aria-labelledby="roles-role-trigger">
                <li>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedRoleId === ''}
                    className={selectedRoleId === '' ? 'is-selected' : ''}
                    onClick={() => selectRole('')}
                  >
                    Select a role
                  </button>
                </li>
                {roles.map((role) => (
                  <li key={role.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={role.id === selectedRoleId}
                      className={role.id === selectedRoleId ? 'is-selected' : ''}
                      onClick={() => selectRole(role.id)}
                    >
                      {role.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button type="submit" className="roles-save-btn" disabled={saveDisabled}>
          <Check size={16} strokeWidth={2.5} />
          {submitting ? 'Saving...' : 'Save role'}
        </button>
      </form>
      {!loading && users.length === 0 && !errorMsg && (
        <p className="roles-empty">No users are available to assign a role.</p>
      )}

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3500}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
