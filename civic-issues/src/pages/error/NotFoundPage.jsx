import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { USER_ROLES } from '../../constants/roles';

const NotFoundPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (!user) {
      navigate('/');
      return;
    }

    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case USER_ROLES.CITIZEN:
        navigate('/citizen/dashboard');
        break;
      case USER_ROLES.OFFICER:
        navigate('/officer/dashboard');
        break;
      case USER_ROLES.ADMIN:
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h2>
        <p className="mt-2 text-gray-600 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Button variant="primary" onClick={handleGoHome}>
            Go back home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;