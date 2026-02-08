import { STORAGE_KEYS } from '../constants/routes';

/* ─── Generic helpers (JSON only) ─── */

export const getItem = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[storage] setItem failed:', e);
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('[storage] removeItem failed:', e);
  }
};

/* ─── TOKEN (RAW STRING — NOT JSON) ─── */

export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const setToken = (token) => {
  if (typeof token === 'string') {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }
};

export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

/* ─── USER (JSON) ─── */

export const getUser = () => getItem(STORAGE_KEYS.USER);
export const setUser = (user) => setItem(STORAGE_KEYS.USER, user);
export const removeUser = () => removeItem(STORAGE_KEYS.USER);

/* ─── SELECTED DEPARTMENT ─── */

export const getSelectedDept = () => getItem(STORAGE_KEYS.SELECTED_DEPT);
export const setSelectedDept = (id) => setItem(STORAGE_KEYS.SELECTED_DEPT, id);
export const removeSelectedDept = () => removeItem(STORAGE_KEYS.SELECTED_DEPT);

/* ─── THEME ─── */

export const getTheme = () => getItem(STORAGE_KEYS.THEME) || 'light';
export const setTheme = (t) => setItem(STORAGE_KEYS.THEME, t);

/* ─── CLEAR ALL ON LOGOUT ─── */

export const clearAll = () => {
  removeToken();
  removeUser();
};
