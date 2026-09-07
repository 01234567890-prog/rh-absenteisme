import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UsersPage } from './pages/admin/UsersPage';
import { RolesPage } from './pages/admin/RolesPage';
import { DepartementsPage } from './pages/admin/DepartementsPage';
import { PositionsPage } from './pages/admin/PositionsPage';
import { PredictionsPage } from './pages/admin/PredictionsPage';
import { AdminResourcePage } from './components/admin/AdminResourcePage';

import { RhLayout } from './components/rh/RhLayout';
import { RhDashboard } from './pages/rh/RhDashboard';

import { EmployeesPage } from './pages/rh/EmployeesPage';
import { ContractsPage } from './pages/rh/ContractsPage';
import { LeavesPage } from './pages/rh/LeavesPage';
import { RhPredictionsPage } from './pages/rh/PredictionsPage';

import { ManagerLayout } from './components/manager/ManagerLayout';
import { ManagerDashboard } from './pages/manager/ManagerDashboard';
import { EvaluationsPage } from './pages/manager/EvaluationsPage';
import { AttendancePage } from './pages/manager/AttendancePage';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Login
  if (currentPath === '/login') {
    return <LoginPage onNavigate={navigate} />;
  }

  // Admin routes
  if (currentPath.startsWith('/admin')) {
    return (
      <ProtectedRoute requiredRole="ADMIN" onNavigate={navigate}>
        <AdminLayout currentPath={currentPath} onNavigate={navigate}>
          
          {currentPath === '/admin/users' && <UsersPage />}

          {currentPath === '/admin/roles' && <RolesPage />}

          {currentPath === '/admin/departments' && <DepartementsPage />}

          {currentPath === '/admin/positions' && <PositionsPage />}

          {currentPath === '/admin/contracts' && (
            <AdminResourcePage
              resource="contracts"
              title="Contracts"
              subtitle="Consult workforce contract records and current statuses."
            />
          )}

          {currentPath === '/admin/leaves' && (
            <AdminResourcePage
              resource="leaves"
              title="Leaves"
              subtitle="Consult leave requests and approved absence periods."
            />
          )}

          {currentPath === '/admin/presences' && (
            <AdminResourcePage
              resource="presences"
              title="Présences"
              subtitle="Consult attendance and presence records across the workforce."
            />
          )}

          {currentPath === '/admin/evaluations' && (
            <AdminResourcePage
              resource="evaluations"
              title="Évaluations"
              subtitle="Consult performance, competency, and behavior evaluations."
            />
          )}

          {currentPath === '/admin/predictions' && <PredictionsPage />}

          {(currentPath === '/admin/dashboard' ||
            currentPath === '/admin') && (
            <AdminDashboard onNavigate={navigate} />
          )}

        </AdminLayout>
      </ProtectedRoute>
    );
  }

  // RH Manager routes
  if (currentPath.startsWith('/rh')) {
    return (
      <ProtectedRoute
        requiredRole="RH_MANAGER"
        onNavigate={navigate}
      >
        <RhLayout currentPath={currentPath} onNavigate={navigate}>
  {currentPath === '/rh/employees' && <EmployeesPage />}
  {currentPath === '/rh/contracts' && <ContractsPage />}
  {currentPath === '/rh/leaves' && <LeavesPage />}
  {currentPath === '/rh/predictions' && <RhPredictionsPage />}
  {(currentPath === '/rh/dashboard' || currentPath === '/rh') && <RhDashboard />}
</RhLayout>
      </ProtectedRoute>
    );
  }


  // Manager routes
  if (currentPath.startsWith('/manager')) {
  return (
    <ProtectedRoute requiredRole="MANAGER" onNavigate={navigate}>
      <ManagerLayout currentPath={currentPath} onNavigate={navigate}>
        {currentPath === '/manager/evaluations' && <EvaluationsPage />}
        {currentPath === '/manager/attendance' && <AttendancePage />}
        {(currentPath === '/manager/dashboard' || currentPath === '/manager') && <ManagerDashboard />}
      </ManagerLayout>
    </ProtectedRoute>
  );
}
  // Default route
  return <LandingPage onNavigate={navigate} />;
}

export default App;