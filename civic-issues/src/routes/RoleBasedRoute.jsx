import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { hasRole } from '../utils/permissions';

/**
 * Wraps a route that requires a specific role (or one of several).
 * If user's role doesn't match → redirect to /unauthorized.
 *
 * @param {string|string[]} allowedRoles - Single role or array of roles
 */
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, ProtectedRoute will have already redirected to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the allowed list
  if (!hasRole(user, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;