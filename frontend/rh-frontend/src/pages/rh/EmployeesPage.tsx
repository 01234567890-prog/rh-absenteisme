import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { DepartementResponseDto, UserResponseDto } from '../../types/api';
import './EmployeesPage.css';

export const EmployeesPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [departements, setDepartements] = useState<DepartementResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    const [usersResult, deptResult] = await Promise.allSettled([
      api.getUsers(),
      api.getDepartements(),
    ]);
    if (usersResult.status === 'fulfilled') setUsers(usersResult.value);
    else {
      const status = (usersResult.reason as any)?.response?.status;
      setErrorMsg(status === 401 || status === 403 ? `Accès refusé (${status}).` : 'Impossible de charger les employés.');
    }
    if (deptResult.status === 'fulfilled') setDepartements(deptResult.value);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const getDeptName = (id?: number) => departements.find((d) => d.id === id)?.name || '-';

  const handleAssign = async (user: UserResponseDto, departementId: number | undefined) => {
    setSavingId(user.id);
    try {
      await api.updateUser(user.id, {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || '',
        status: user.status || 'ACTIVE',
        departementId,
        roleId: user.roleId,
        positionId: user.positionId,
        managerId: user.managerId,
      });
      await loadData();
    } catch (err: any) {
      alert('Erreur : ' + (err.message || 'impossible de mettre à jour le département.'));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">People Operations</p>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Consultez les employés et gérez leur affectation aux départements.</p>
        </div>
      </div>

      {errorMsg && <div className="page-error" role="alert"><span>{errorMsg}</span><button onClick={loadData}>Réessayer</button></div>}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr><th>Employé</th><th>Email</th><th>Département</th><th>Assigner à</th><th>Action</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="table-state">Chargement...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="table-state">Aucun employé trouvé.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{getDeptName(user.departementId)}</td>
                  <td>
                    <select
                      className="dept-select"
                      value={user.departementId ?? ''}
                      disabled={savingId === user.id}
                      onChange={(e) => handleAssign(user, e.target.value ? Number(e.target.value) : undefined)}
                    >
                      <option value="">Aucun</option>
                      {departements.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="remove-dept-btn"
                      disabled={!user.departementId || savingId === user.id}
                      onClick={() => handleAssign(user, undefined)}
                    >
                      Retirer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};