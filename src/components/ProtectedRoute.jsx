import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext.jsx';

function ProtectedRoute({ children, allowedRoles, requiredRole, redirectPath }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = user?.role;

  // NEW: array-based roles (e.g., allowedRoles={['admin','consultant']})
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      // FIXED: Smart redirect based on user role
      const defaultRoute = getDefaultRouteForRole(role);
      return <Navigate to={redirectPath || defaultRoute} replace />;
    }
  }
  // OLD prop still works (backward-compat)
  else if (requiredRole) {
    if (!role || role !== requiredRole) {
      const defaultRoute = getDefaultRouteForRole(role);
      return <Navigate to={redirectPath || defaultRoute} replace />;
    }
  }

  return children;
}

// NEW: Helper function to determine default route based on user role
function getDefaultRouteForRole(role) {
  switch (role) {
    case 'admin':
      return '/admin';  // Admin goes to admin dashboard
    case 'consultant':
      return '/';       // Consultant goes to regular dashboard
    case 'client':
      return '/';       // Client goes to regular dashboard
    default:
      return '/login';  // Unknown role goes to login
  }
}

export default ProtectedRoute;