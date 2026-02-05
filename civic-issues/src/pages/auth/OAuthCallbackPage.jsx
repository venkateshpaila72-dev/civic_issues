import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { extractOAuthToken, getCurrentUser } from '../../api/services/authService';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

/**
 * After Google OAuth, backend redirects to:
 *   /oauth-success?token=JWT_TOKEN
 * This page extracts the token, fetches user data, logs in, and redirects.
 */
const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Extract token from URL
        const token = extractOAuthToken();

        if (!token) {
          setError('No authentication token received. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Store token temporarily so axios interceptor can use it
        localStorage.setItem('civic_token', token);

        // Fetch user data
        const response = await getCurrentUser();

        if (response?.success && response?.data?.user) {
          login(token, response.data.user);
          navigate('/citizen/dashboard', { replace: true });
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Authentication failed. Redirecting to login...');
        localStorage.removeItem('civic_token');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleOAuthCallback();
  }, [navigate, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="max-w-md w-full">
          <ErrorMessage message={error} />
        </div>
      ) : (
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600">Completing sign-in...</p>
        </div>
      )}
    </div>
  );
};

export default OAuthCallbackPage;