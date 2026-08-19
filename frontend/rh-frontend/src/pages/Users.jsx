import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="users-loading">Loading...</p>;
  if (error) return <p className="users-error">{error}</p>;

  return (
    <div>
      <h1 className="users-page-title">Users ({users.length})</h1>

      <div className="users-table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Hire Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="users-avatar-cell">
                    <div className="users-avatar">
                      {u.firstName.charAt(0).toUpperCase()}
                    </div>
                    {u.firstName} {u.lastName}
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.phoneNumber || "—"}</td>
                <td>{u.hireDate}</td>
                <td>
                  <span className={`users-status ${u.status}`}>
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}