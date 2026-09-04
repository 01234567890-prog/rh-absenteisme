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

  // Route matching
  if (currentPath === '/login') {
    return <LoginPage onNavigate={navigate} />;
  }

  if (currentPath.startsWith('/admin')) {
    return (
      <ProtectedRoute requiredRole="ADMIN" onNavigate={navigate}>
        <AdminLayout currentPath={currentPath} onNavigate={navigate}>
          {currentPath === '/admin/users' && <UsersPage />}
          {currentPath === '/admin/roles' && <RolesPage />}
          {currentPath === '/admin/departments' && <DepartementsPage />}
          {currentPath === '/admin/positions' && <PositionsPage />}
          {currentPath === '/admin/contracts' && (
            <AdminResourcePage resource="contracts" title="Contracts" subtitle="Consult workforce contract records and current statuses." />
          )}
          {currentPath === '/admin/leaves' && (
            <AdminResourcePage resource="leaves" title="Leaves" subtitle="Consult leave requests and approved absence periods." />
          )}
          {currentPath === '/admin/presences' && (
            <AdminResourcePage resource="presences" title="Présences" subtitle="Consult attendance and presence records across the workforce." />
          )}
          {currentPath === '/admin/evaluations' && (
            <AdminResourcePage resource="evaluations" title="Évaluations" subtitle="Consult performance, competency, and behavior evaluations." />
          )}
          {currentPath === '/admin/predictions' && <PredictionsPage />}
          {(currentPath === '/admin/dashboard' || currentPath === '/admin') && (
            <AdminDashboard onNavigate={navigate} />
          )}
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return <LandingPage onNavigate={navigate} />;
}

export default App;
