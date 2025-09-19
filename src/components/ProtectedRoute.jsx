import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext.jsx';

function ProtectedRoute({ children, allowedRoles, requiredRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = user?.role;

  // NEW: array-based roles (e.g., allowedRoles={['admin','consultant']})
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;
  }
  // OLD prop still works (backward-compat)
  else if (requiredRole) {
    if (!role || role !== requiredRole) return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
