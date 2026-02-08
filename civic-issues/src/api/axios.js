import axios from 'axios';
import { STORAGE_KEYS } from '../constants/routes';

/* ─── base URL ─── */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/* ─── instance ─── */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 s
});

/* ─── request interceptor — attach JWT ─── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ─── response interceptor — handle 401 globally ─── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — wipe client state
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

      // Only redirect if we are NOT already on an auth page
      /*const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
      const currentPath = window.location.pathname;

      if (!authPages.some((p) => currentPath.startsWith(p))) {
        window.location.href = '/login';
      }*/
    }

    return Promise.reject(error);
  }
);

export default api;