import api from '../axios';
import { AUTH } from '../endpoints';

/* ─── Register (manual with email+password) ─── */
export const register = async (credentials) => {
  const { data } = await api.post(AUTH.REGISTER, credentials);
  return data;
};

/* ─── Login (manual with email+password) ─── */
export const login = async (credentials) => {
  const { data } = await api.post(AUTH.LOGIN, credentials);
  
  return data;
};

/* ─── Get current user ─── */
export const getCurrentUser = async () => {
  const { data } = await api.get(AUTH.ME);
  return data;
};

/* ─── Logout ─── */
export const logout = async () => {
  const { data } = await api.post(AUTH.LOGOUT);
  return data;
};

/* ─── Refresh user data ─── */
export const refreshUser = async () => {
  const { data } = await api.post(AUTH.REFRESH);
  return data;
};

/* ─── Google OAuth: initiate (redirect to backend Google OAuth flow) ─── */
export const initiateGoogleOAuth = () => {
  // This redirects the entire page to backend which then redirects to Google
  window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}${AUTH.GOOGLE}`;
};

/**
 * After Google OAuth success, backend redirects to:
 *   /oauth-success?token=JWT_TOKEN
 * This helper extracts the token from URL params.
 */
export const extractOAuthToken = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
};