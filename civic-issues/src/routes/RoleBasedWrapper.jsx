import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { hasRole } from '../utils/permissions';
import Loader from '../components/common/Loader';

const RoleBasedWrapper = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(user, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children; // ✅ correct here
};

export default RoleBasedWrapper;
