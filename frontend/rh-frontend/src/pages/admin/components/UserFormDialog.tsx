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

export const toUserFormValues = (
  user?: UserResponseDto
): UserFormValues => ({
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  email: user?.email || '',
  password: '',
  phoneNumber: user?.phoneNumber || '',
  hireDate:
    user?.hireDate || new Date().toISOString().split('T')[0],
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

  // Default values for create mode
  departementId: departments[0]?.id,
  roleId: roles[0]?.id,
  positionId: positions[0]?.id,
  managerId: undefined,
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
  const [values, setValues] =
    useState<UserFormValues>(initialValues);

  useEffect(() => {
    if (open) {
      setValues(initialValues);
    }
  }, [open, initialValues]);

  if (!open) {
    return null;
  }

  const setValue = <K extends keyof UserFormValues>(
    key: K,
    value: UserFormValues[K]
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    onSubmit(values);
  };

  const isCreate = mode === 'create';

  return (
    <div
      className="custom-modal-overlay"
      onClick={submitting ? undefined : onClose}
    >
      <div
        className="custom-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="custom-modal-header">
          <div>
            <div className="custom-modal-category">
              ADMINISTRATION
            </div>

            <h2 className="custom-modal-title">
              {isCreate ? 'Add user' : 'Edit user'}
            </h2>
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

        {/* Error */}
        {error && (
          <div className="custom-modal-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="custom-modal-form"
        >
          <div className="custom-form-grid">

            {/* Row 1: First name / Last name */}
            <div className="custom-form-group">
              <label htmlFor="user-firstname">
                First name
              </label>

              <input
                id="user-firstname"
                type="text"
                value={values.firstName}
                onChange={(event) =>
                  setValue(
                    'firstName',
                    event.target.value
                  )
                }
                required
                placeholder="First name"
              />
            </div>

            <div className="custom-form-group">
              <label htmlFor="user-lastname">
                Last name
              </label>

              <input
                id="user-lastname"
                type="text"
                value={values.lastName}
                onChange={(event) =>
                  setValue(
                    'lastName',
                    event.target.value
                  )
                }
                required
                placeholder="Last name"
              />
            </div>

            {/* Row 2: Email / Phone */}
            <div className="custom-form-group">
              <label htmlFor="user-email">
                Email
              </label>

              <input
                id="user-email"
                type="email"
                value={values.email}
                onChange={(event) =>
                  setValue(
                    'email',
                    event.target.value
                  )
                }
                required
                disabled={!isCreate}
                placeholder="Email"
              />
            </div>

            <div className="custom-form-group">
              <label htmlFor="user-phone">
                Phone
              </label>

              <input
                id="user-phone"
                type="text"
                value={values.phoneNumber}
                onChange={(event) =>
                  setValue(
                    'phoneNumber',
                    event.target.value
                  )
                }
                required
                placeholder="Phone"
              />
            </div>

            {/* Row 3: Password / Hire date */}
            {isCreate ? (
              <div className="custom-form-group">
                <label htmlFor="user-password">
                  Password
                </label>

                <input
                  id="user-password"
                  type="password"
                  value={values.password}
                  onChange={(event) =>
                    setValue(
                      'password',
                      event.target.value
                    )
                  }
                  required
                  minLength={8}
                  placeholder="Password"
                />
              </div>
            ) : (
              <div className="custom-form-group">
                <label htmlFor="user-department">
                  Department
                </label>

                <select
                  id="user-department"
                  value={values.departementId ?? ''}
                  onChange={(event) =>
                    setValue(
                      'departementId',
                      event.target.value
                        ? Number(event.target.value)
                        : undefined
                    )
                  }
                >
                  <option value="" disabled>
                    Select department
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="custom-form-group">
              <label htmlFor="user-hiredate">
                Hire date
              </label>

              <input
                id="user-hiredate"
                type="date"
                value={values.hireDate}
                onChange={(event) =>
                  setValue(
                    'hireDate',
                    event.target.value
                  )
                }
                required
              />
            </div>

            {/* Row 4: Status / Role */}
            <div className="custom-form-group">
              <label htmlFor="user-status">
                Status
              </label>

              <select
                id="user-status"
                value={values.status ?? 'ACTIVE'}
                onChange={(event) =>
                  setValue(
                    'status',
                    event.target.value as UserStatus
                  )
                }
                required
              >
                <option value="ACTIVE">
                  Active
                </option>

                <option value="EN_LEAVE">
                  On leave
                </option>

                <option value="SUSPENDED">
                  Suspended
                </option>

                <option value="RESIGNED">
                  Resigned
                </option>

                <option value="TERMINATED">
                  Terminated
                </option>
              </select>
            </div>

            <div className="custom-form-group">
              <label htmlFor="user-role">
                Role
              </label>

              <select
                id="user-role"
                value={values.roleId ?? ''}
                onChange={(event) =>
                  setValue(
                    'roleId',
                    event.target.value
                      ? Number(event.target.value)
                      : undefined
                  )
                }
                required
              >
                <option value="" disabled>
                  Select a role
                </option>

                {roles.map((role) => (
                  <option
                    key={role.id}
                    value={role.id}
                  >
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 5: Position / Manager */}
            <div className="custom-form-group">
              <label htmlFor="user-position">
                Position
              </label>

              <select
                id="user-position"
                value={values.positionId ?? ''}
                onChange={(event) =>
                  setValue(
                    'positionId',
                    event.target.value
                      ? Number(event.target.value)
                      : undefined
                  )
                }
                required
              >
                <option value="" disabled>
                  Select position
                </option>

                {positions.map((position) => (
                  <option
                    key={position.id}
                    value={position.id}
                  >
                    {position.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="custom-form-group">
              <label htmlFor="user-manager">
                Manager
              </label>

              <select
                id="user-manager"
                value={values.managerId ?? ''}
                onChange={(event) =>
                  setValue(
                    'managerId',
                    event.target.value
                      ? Number(event.target.value)
                      : undefined
                  )
                }
              >
                <option value="">
                  No manager
                </option>

                {users.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.firstName} {user.lastName} (
                    {user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Row 6: Department for Create */}
            {isCreate && (
              <div className="custom-form-group">
                <label htmlFor="user-department-create">
                  Department
                </label>

                <select
                  id="user-department-create"
                  value={values.departementId ?? ''}
                  onChange={(event) =>
                    setValue(
                      'departementId',
                      event.target.value
                        ? Number(event.target.value)
                        : undefined
                    )
                  }
                  required
                >
                  <option value="" disabled>
                    Select department
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
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

/**
 * Convert form values to the payload expected
 * by the backend when creating a user.
 */
export const toCreatePayload = (
  values: UserFormValues
): UserRequestDto => ({
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
  managerId: values.managerId,
});

/**
 * Convert form values to the payload expected
 * by the backend when updating a user.
 */
export const toUpdatePayload = (
  values: UserFormValues
): UserUpdateRequestDto => ({
  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  phoneNumber: values.phoneNumber.trim(),
  status: values.status,

  departementId: values.departementId,
  roleId: values.roleId,
  positionId: values.positionId,
  managerId: values.managerId,
});