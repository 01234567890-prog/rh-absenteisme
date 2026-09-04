import React, { useEffect } from 'react';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  requiredRole?: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole = 'ADMIN',
  onNavigate,
  children,
}) => {
  const role = authService.getRole();

  const isAuthenticated = authService.isAuthenticated();
  const hasRequiredRole = !requiredRole || role === requiredRole;

  useEffect(() => {
    if (!isAuthenticated || !hasRequiredRole) {
      onNavigate('/login');
    }
  }, [isAuthenticated, hasRequiredRole, onNavigate]);

  if (!isAuthenticated || !hasRequiredRole) {
    return null;
  }

  return <>{children}</>;
};
