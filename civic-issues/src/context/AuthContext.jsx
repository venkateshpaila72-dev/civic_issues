import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken, getUser, setUser, removeUser, clearAll } from '../utils/storage';
import { getDefaultDashboard } from '../utils/permissions';
import api from '../api/axios';
import { AUTH } from '../api/endpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* ─── Initialize from localStorage ─── */
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(AUTH.ME);

        if (data?.success && data?.data?.user) {
          setUserState(data.data.user);
          setIsAuthenticated(true);
          setUser(data.data.user); // sync storage
        } else {
          clearAll();
        }
      } catch (err) {
        clearAll();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);


  /* ─── Login ─── */
  const login = (token, userData) => {
    clearAll();
    setToken(token);
    setUser(userData);
    setUserState(userData);
    setIsAuthenticated(true);
  };

  /* ─── Logout ─── */
  const logout = async (navigate) => {
    try {
      await api.post(AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearAll();
      setUserState(null);
      setIsAuthenticated(false);

      // 🔥 force route reset
      navigate('/login', { replace: true });
    }
  };

  /* ─── Update user (after profile edit) ─── */
  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    setUserState(merged);
  };

  /* ─── Refresh user data from backend ─── */
  const refreshUser = async () => {
    try {
      const { data } = await api.post(AUTH.REFRESH);
      if (data?.success && data?.data?.user) {
        const freshUser = data.data.user;
        setUser(freshUser);
        setUserState(freshUser);
        return freshUser;
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      // On failure, keep current user state
    }
    return user;
  };

  /* ─── Get default dashboard path for the current user ─── */
  const getDashboardPath = () => getDefaultDashboard(user);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    refreshUser,
    getDashboardPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ─── Hook ─── */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;