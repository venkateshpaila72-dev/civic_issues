import { STORAGE_KEYS } from '../constants/routes';

/* ─── Generic get / set / remove ─── */

/**
 * Read a JSON value from localStorage.
 * Returns null on miss or parse failure.
 */
export const getItem = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Write a value to localStorage as JSON.
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[storage] setItem failed:', e);
  }
};

/**
 * Remove a single key.
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('[storage] removeItem failed:', e);
  }
};

/* ─── App-specific helpers ─── */

export const getToken        = ()      => getItem(STORAGE_KEYS.TOKEN);
export const setToken        = (token) => setItem(STORAGE_KEYS.TOKEN, token);
export const removeToken     = ()      => removeItem(STORAGE_KEYS.TOKEN);

export const getUser         = ()      => getItem(STORAGE_KEYS.USER);
export const setUser         = (user)  => setItem(STORAGE_KEYS.USER, user);
export const removeUser      = ()      => removeItem(STORAGE_KEYS.USER);

export const getSelectedDept = ()      => getItem(STORAGE_KEYS.SELECTED_DEPT);
export const setSelectedDept = (id)    => setItem(STORAGE_KEYS.SELECTED_DEPT, id);
export const removeSelectedDept = ()   => removeItem(STORAGE_KEYS.SELECTED_DEPT);

export const getTheme        = ()      => getItem(STORAGE_KEYS.THEME) || 'light';
export const setTheme        = (t)     => setItem(STORAGE_KEYS.THEME, t);

/** Wipe everything the app wrote — used on logout */
export const clearAll = () => {
  removeToken();
  removeUser();
  removeSelectedDept();
};