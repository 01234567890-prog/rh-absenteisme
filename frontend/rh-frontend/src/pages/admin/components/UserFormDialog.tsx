import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type {
  DepartementResponseDto,
  PositionResponseDto,
  RoleResponseDto,
  UserRequestDto,
  UserResponseDto,
  UserStatus,
  UserUpdateRequestDto,
} from '../../../types/api';

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  hireDate: string;
  status?: UserStatus;
  departementId?: number;
  roleId?: number;
  positionId?: number;
  managerId?: number;
}

interface UserFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues: UserFormValues;
  departments: DepartementResponseDto[];
  positions: PositionResponseDto[];
  roles: RoleResponseDto[];
  users: UserResponseDto[];
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
}

export const toUserFormValues = (user?: UserResponseDto): UserFormValues => ({
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  email: user?.email || '',
  password: '',
  phoneNumber: user?.phoneNumber || '',
  hireDate: user?.hireDate || new Date().toISOString().split('T')[0],
  status: user?.status || 'ACTIVE',
  departementId: user?.departementId,
  roleId: user?.roleId,
  positionId: user?.positionId,
  managerId: user?.managerId,
});

export const createDefaultUserFormValues = (
  departments: DepartementResponseDto[],
  positions: PositionResponseDto[],
  roles: RoleResponseDto[]
): UserFormValues => ({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
  hireDate: new Date().toISOString().split('T')[0],
  status: 'ACTIVE',
  departementId: departments[0]?.id,
  roleId: roles[0]?.id,
  positionId: positions[0]?.id,
});

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  mode,
  initialValues,
  departments,
  positions,
  roles,
  users,
  submitting,
  error,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<UserFormValues>(initialValues);

  useEffect(() => {
    if (open) setValues(initialValues);
  }, [open, initialValues]);

  if (!open) return null;

  const setValue = <K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  const isCreate = mode === 'create';

  return (
    <div className="custom-modal-overlay" onClick={submitting ? undefined : onClose}>
      <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="custom-modal-header">
          <div>
            <div className="custom-modal-category">ADMINISTRATION</div>
            <h2 className="custom-modal-title">{isCreate ? 'Add user' : 'Edit user'}</h2>
          </div>
          <button
            type="button"
            className="custom-modal-close-btn"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {error && <div className="custom-modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="custom-modal-form">
          <div className="custom-form-grid">
            {/* Row 1: First name & Last name */}
            <div className="custom-form-group">
              <label htmlFor="user-firstname">First name</label>
              <input
                id="user-firstname"
                type="text"
                value={values.firstName}
                onChange={(e) => setValue('firstName', e.target.value)}
                required
                placeholder="First name"
              />
            </div>

            <div className="custom-form-group">
              <label htmlFor="user-lastname">Last name</label>
              <input
                id="user-lastname"
                type="text"
                value={values.lastName}
                onChange={(e) => setValue('lastName', e.target.value)}
                required
                placeholder="Last name"
              />
            </div>

            {/* Row 2: Email & Phone */}
            <div className="custom-form-group">
              <label htmlFor="user-email">Email</label>
              <input
                id="user-email"
                type="email"
                value={values.email}
                onChange={(e) => setValue('email', e.target.value)}
                required
                disabled={!isCreate}
                placeholder="Email"
              />
            </div>

            <div className="custom-form-group">
              <label htmlFor="user-phone">Phone</label>
              <input
                id="user-phone"
                type="text"
                value={values.phoneNumber}
                onChange={(e) => setValue('phoneNumber', e.target.value)}
                required
                placeholder="Phone"
              />
            </div>

            {/* Row 3: Password & Hire date */}
            {isCreate ? (
              <div className="custom-form-group">
                <label htmlFor="user-password">Password</label>
                <input
                  id="user-password"
                  type="password"
                  value={values.password}
                  onChange={(e) => setValue('password', e.target.value)}
                  required
                  minLength={8}
                  placeholder="Password"
                />
              </div>
            ) : (
              <div className="custom-form-group">
                <label htmlFor="user-department">Department</label>
                <select
                  id="user-department"
                  value={values.departementId ?? ''}
                  onChange={(e) => setValue('departementId', e.target.value ? Number(e.target.value) : undefined)}
                >
                  <option value="" disabled>Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="custom-form-group">
              <label htmlFor="user-hiredate">Hire date</label>
              <input
                id="user-hiredate"
                type="date"
                value={values.hireDate}
                onChange={(e) => setValue('hireDate', e.target.value)}
                required
              />
            </div>

            {/* Row 4: Status & Role */}
            <div className="custom-form-group">
              <label htmlFor="user-status">Status</label>
              <select
                id="user-status"
                value={values.status ?? 'ACTIVE'}
                onChange={(e) => setValue('status', e.target.value as UserStatus)}
                required
              >
                <option value="ACTIVE">Active</option>
                <option value="EN_LEAVE">On leave</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="RESIGNED">Resigned</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>

            <div className="custom-form-group">
              <label htmlFor="user-role">Role</label>
              <select
                id="user-role"
                value={values.roleId ?? ''}
                onChange={(e) => setValue('roleId', e.target.value ? Number(e.target.value) : undefined)}
                required
              >
                <option value="" disabled>
                  Select a role
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Extra row for Edit mode: Position & Manager */}
            {!isCreate && (
              <>
                <div className="custom-form-group">
                  <label htmlFor="user-position">Position</label>
                  <select
                    id="user-position"
                    value={values.positionId ?? ''}
                    onChange={(e) => setValue('positionId', e.target.value ? Number(e.target.value) : undefined)}
                  >
                    <option value="" disabled>Select position</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="custom-form-group">
                  <label htmlFor="user-manager">Manager</label>
                  <select
                    id="user-manager"
                    value={values.managerId ?? ''}
                    onChange={(e) => setValue('managerId', e.target.value ? Number(e.target.value) : undefined)}
                  >
                    <option value="">No manager</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.firstName} {u.lastName} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {isCreate && (
              <div className="custom-form-group">
                <label htmlFor="user-department-create">Department</label>
                <select
                  id="user-department-create"
                  value={values.departementId ?? ''}
                  onChange={(e) => setValue('departementId', e.target.value ? Number(e.target.value) : undefined)}
                >
                  <option value="" disabled>Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="custom-modal-actions">
            <button
              type="button"
              className="custom-btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="custom-btn-submit"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : isCreate
                ? 'Create user'
                : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const toCreatePayload = (values: UserFormValues): UserRequestDto => ({
  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  email: values.email.trim(),
  password: values.password,
  phoneNumber: values.phoneNumber.trim(),
  hireDate: values.hireDate,
  status: values.status as UserStatus,
  departementId: values.departementId,
  roleId: values.roleId,
  positionId: values.positionId,
});

export const toUpdatePayload = (values: UserFormValues): UserUpdateRequestDto => ({
  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  phoneNumber: values.phoneNumber.trim(),
  status: values.status,
  departementId: values.departementId,
  roleId: values.roleId,
  positionId: values.positionId,
  managerId: values.managerId,
});
