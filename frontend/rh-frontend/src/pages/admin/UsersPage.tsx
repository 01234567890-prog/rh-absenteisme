import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Tooltip,
} from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import type {
  DepartementResponseDto,
  PositionResponseDto,
  RoleResponseDto,
  UserResponseDto,
} from '../../types/api';
import {
  createDefaultUserFormValues,
  toCreatePayload,
  toUpdatePayload,
  toUserFormValues,
  UserFormDialog,
  type UserFormValues,
} from './components/UserFormDialog';
import './UsersPage.css';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [departements, setDepartements] = useState<DepartementResponseDto[]>([]);
  const [positions, setPositions] = useState<PositionResponseDto[]>([]);
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | null>(null);
  const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null);

  const [dialogValues, setDialogValues] = useState<UserFormValues>(() =>
    createDefaultUserFormValues([], [], [])
  );

  const [dialogError, setDialogError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserResponseDto | null>(null);

  const [successMessage, setSuccessMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');

    const [
      usersResult,
      departmentsResult,
      positionsResult,
      rolesResult,
    ] = await Promise.allSettled([
      api.getUsers(),
      api.getDepartements(),
      api.getPositions(),
      api.getRoles(),
    ]);

    if (usersResult.status === 'fulfilled') {
      setUsers(usersResult.value);
    } else {
      console.error('Error fetching users:', usersResult.reason);

      const status = usersResult.reason?.response?.status;

      setErrorMsg(
        status === 401 || status === 403
          ? `User directory access denied (${status}). Please sign in again or contact an administrator.`
          : usersResult.reason?.message || 'Failed to load user data'
      );
    }

    if (departmentsResult.status === 'fulfilled') {
      setDepartements(departmentsResult.value);
    }

    if (positionsResult.status === 'fulfilled') {
      setPositions(positionsResult.value);
    }

    if (rolesResult.status === 'fulfilled') {
      setRoles(rolesResult.value);
    }

    if (
      [
        departmentsResult,
        positionsResult,
        rolesResult,
      ].some((result) => result.status === 'rejected') &&
      usersResult.status === 'fulfilled'
    ) {
      console.error('Some user metadata requests failed:', {
        departmentsResult,
        positionsResult,
        rolesResult,
      });

      setErrorMsg(
        'Users loaded, but some department, position, or role details are unavailable.'
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateDialog = () => {
    setDialogError('');
    setEditingUser(null);

    setDialogValues(
      createDefaultUserFormValues(
        departements,
        positions,
        roles
      )
    );

    setDialogMode('create');
  };

  const openEditDialog = (user: UserResponseDto) => {
    setDialogError('');
    setEditingUser(user);
    setDialogValues(toUserFormValues(user));
    setDialogMode('edit');
  };

  const closeDialog = () => {
    if (!submitting) {
      setDialogMode(null);
      setEditingUser(null);
      setDialogError('');
    }
  };

  const errorMessage = (
    error: unknown,
    fallback: string
  ) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error
    ) {
      const response = (
        error as {
          response?: {
            status?: number;
            data?: {
              message?: string;
            };
          };
        }
      ).response;

      if (response?.data?.message) {
        return response.data.message;
      }

      if (response?.status === 400) {
        return 'The request is invalid. Check the user details and try again.';
      }

      if (response?.status === 401) {
        return 'Your session is no longer authorized. Please sign in again.';
      }

      if (response?.status === 403) {
        return 'You are not authorized to perform this action.';
      }

      if (response?.status === 404) {
        return 'The user no longer exists.';
      }

      if (response?.status === 409) {
        return 'This user cannot be changed because it conflicts with existing data.';
      }

      if (response?.status === 500) {
        return 'The server could not complete this action. Existing HR records may reference this user.';
      }
    }

    return error instanceof Error
      ? error.message
      : fallback;
  };

  const handleDialogSubmit = async (
    values: UserFormValues
  ) => {
    const currentEmail = localStorage.getItem('email');
    const currentRole = localStorage.getItem('role');

    const selectedRole = roles.find(
      (role) => role.id === values.roleId
    )?.name;

    if (
      dialogMode === 'edit' &&
      editingUser &&
      currentEmail &&
      editingUser.email.toLowerCase() ===
        currentEmail.toLowerCase() &&
      currentRole === 'ADMIN' &&
      selectedRole !== 'ADMIN'
    ) {
      setDialogError(
        'You cannot remove your own ADMIN access from this dialog.'
      );
      return;
    }

    setSubmitting(true);
    setDialogError('');

    try {
      if (dialogMode === 'create') {
        await api.createUser(
          toCreatePayload(values)
        );

        setSuccessMessage(
          'User created successfully.'
        );
      } else if (editingUser) {
        await api.updateUser(
          editingUser.id,
          toUpdatePayload(values)
        );

        setSuccessMessage(
          'User updated successfully.'
        );
      }

      setDialogMode(null);
      setEditingUser(null);

      await loadData();
    } catch (error: unknown) {
      setDialogError(
        errorMessage(
          error,
          'Unable to save user details.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const requestDelete = (
    user: UserResponseDto
  ) => {
    const currentEmail =
      localStorage.getItem('email');

    if (
      currentEmail &&
      user.email.toLowerCase() ===
        currentEmail.toLowerCase()
    ) {
      setErrorMsg(
        'You cannot delete the currently authenticated administrator.'
      );
      return;
    }

    setDeleteTarget(user);
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeletingId(deleteTarget.id);

    try {
      await api.deleteUser(deleteTarget.id);

      setSuccessMessage(
        'User deleted successfully.'
      );

      setDeleteTarget(null);

      await loadData();
    } catch (error: unknown) {
      setErrorMsg(
        errorMessage(
          error,
          'Unable to delete user.'
        )
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getDeptName = (id?: number) =>
    departements.find(
      (department) => department.id === id
    )?.name || '-';

  const getRoleName = (id?: number) =>
    roles.find(
      (role) => role.id === id
    )?.name || '-';

  const getPositionTitle = (id?: number) =>
    positions.find(
      (position) => position.id === id
    )?.title || '-';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            User Management
          </h1>

          <p className="page-subtitle">
            Manage accounts, roles, and workforce directory
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={openCreateDialog}
          type="button"
        >
          + Add user
        </button>
      </div>

      {errorMsg && (
        <div
          className="page-error"
          role="alert"
        >
          <span>{errorMsg}</span>

          <button
            onClick={loadData}
            type="button"
          >
            Try again
          </button>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Role</th>
              <th>Position</th>
              <th>Status</th>
              <th className="actions-column">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="table-state"
                >
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="table-state"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>

                  <td className="primary-cell">
                    {user.firstName}{' '}
                    {user.lastName}
                  </td>

                  <td>{user.email}</td>

                  <td>
                    {user.phoneNumber || '-'}
                  </td>

                  <td>
                    {getDeptName(
                      user.departementId
                    )}
                  </td>

                  <td>
                    {getRoleName(
                      user.roleId
                    )}
                  </td>

                  <td>
                    {getPositionTitle(
                      user.positionId
                    )}
                  </td>

                  <td>
                    <span
                      className={`status-tag ${
                        user.status === 'ACTIVE'
                          ? 'status-active'
                          : user.status === 'SUSPENDED'
                          ? 'status-suspended'
                          : user.status === 'EN_LEAVE'
                          ? 'status-leave'
                          : 'status-resigned'
                      }`}
                    >
                      {user.status || 'ACTIVE'}
                    </span>
                  </td>

                  <td className="actions-cell">
                    <div className="action-btns">
                      <Tooltip title="Edit user">
                        <button
                          type="button"
                          className="action-icon-btn pencil-btn"
                          onClick={() =>
                            openEditDialog(user)
                          }
                          aria-label={`Edit ${user.email}`}
                        >
                          <Pencil size={16} />
                        </button>
                      </Tooltip>

                      <Tooltip title="Delete user">
                        <button
                          type="button"
                          className="action-icon-btn trash-btn"
                          onClick={() =>
                            requestDelete(user)
                          }
                          disabled={
                            deletingId === user.id
                          }
                          aria-label={`Delete ${user.email}`}
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

      {dialogMode && (
        <UserFormDialog
          open
          mode={dialogMode}
          initialValues={dialogValues}
          departments={departements}
          positions={positions}
          roles={roles}
          users={users}
          submitting={submitting}
          error={dialogError}
          onClose={closeDialog}
          onSubmit={handleDialogSubmit}
        />
      )}

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={
          deletingId === null
            ? () => setDeleteTarget(null)
            : undefined
        }
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            style: {
              borderRadius: 16,
              padding: 8,
            },
          },
        }}
      >
        <DialogTitle
          style={{
            fontWeight: 700,
            fontSize: '18px',
          }}
        >
          Delete user?
        </DialogTitle>

        <DialogContent>
          <Alert
            severity="warning"
            style={{
              borderRadius: 10,
            }}
          >
            This will permanently remove{' '}
            {deleteTarget?.firstName}{' '}
            {deleteTarget?.lastName}{' '}
            ({deleteTarget?.email}).
            Existing HR records referencing this
            user may prevent deletion.
          </Alert>
        </DialogContent>

        <DialogActions
          style={{
            padding: '8px 24px 16px 24px',
          }}
        >
          <Button
            onClick={() =>
              setDeleteTarget(null)
            }
            disabled={deletingId !== null}
            style={{
              color: '#475569',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deletingId !== null}
            startIcon={
              deletingId !== null ? (
                <span className="button-spinner" />
              ) : (
                <Trash2 size={16} />
              )
            }
            style={{
              borderRadius: 8,
              fontWeight: 600,
              backgroundColor: '#DC2626',
            }}
          >
            {deletingId !== null
              ? 'Deleting...'
              : 'Delete user'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3500}
        onClose={() =>
          setSuccessMessage('')
        }
      >
        <Alert
          severity="success"
          onClose={() =>
            setSuccessMessage('')
          }
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};