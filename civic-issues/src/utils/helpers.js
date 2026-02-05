/* ─── Debounce ─── */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/* ─── Deep clone (simple) ─── */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/* ─── Random ID (for temporary keys / lists) ─── */
export const uid = () => Math.random().toString(36).slice(2, 11);

/* ─── Sleep ─── */
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ─── Capitalize first letter ─── */
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

/* ─── Capitalize every word ─── */
export const titleCase = (str) =>
  str ? str.replace(/\b\w/g, (c) => c.toUpperCase()) : '';

/* ─── Check if value is empty (null, undefined, '', [], {}) ─── */
export const isEmpty = (val) => {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string')  return val.trim() === '';
  if (Array.isArray(val))       return val.length === 0;
  if (typeof val === 'object')  return Object.keys(val).length === 0;
  return false;
};

/* ─── Group an array by a key ─── */
export const groupBy = (arr, keyFn) =>
  arr.reduce((acc, item) => {
    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
    (acc[key] = acc[key] || []).push(item);
    return acc;
  }, {});

/* ─── Pick specific keys from an object ─── */
export const pick = (obj, keys) =>
  keys.reduce((acc, k) => {
    if (k in obj) acc[k] = obj[k];
    return acc;
  }, {});

/* ─── Omit specific keys from an object ─── */
export const omit = (obj, keys) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));