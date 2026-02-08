import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { extractOAuthToken, getCurrentUser } from '../../api/services/authService';
import { STORAGE_KEYS } from '../../constants/routes';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // 1️⃣ Extract token
        const token = extractOAuthToken();

        if (!token) {
          throw new Error('No authentication token received');
        }

        // 2️⃣ SAVE TOKEN (before any API call)
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);

        // 3️⃣ Fetch user (axios interceptor now works)
        const res = await getCurrentUser();

        const user = res?.data?.user;
        if (!user) {
          throw new Error('Failed to fetch user data');
        }

        // 4️⃣ Save user via auth context
        login(token, user);

        // 5️⃣ Redirect by role
        if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (user.role === 'officer') {
          navigate('/officer/select-department', { replace: true });
        } else {
          navigate('/citizen/dashboard', { replace: true });
        }

      } catch (err) {
        console.error('OAuth callback error:', err);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setError('Authentication failed. Redirecting to login...');
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
