/* ─── Parsing ─── */

/** Safe Date constructor — returns null instead of Invalid Date */
export const parseDate = (input) => {
  if (!input) return null;
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
};

/* ─── Comparison ─── */

/** Is the date in the past? */
export const isPast = (dateInput) => {
  const d = parseDate(dateInput);
  return d ? d.getTime() < Date.now() : false;
};

/** Is the date in the future? */
export const isFuture = (dateInput) => {
  const d = parseDate(dateInput);
  return d ? d.getTime() > Date.now() : false;
};

/** Difference in seconds between two dates (a − b) */
export const diffSeconds = (a, b) => {
  const da = parseDate(a);
  const db = parseDate(b);
  if (!da || !db) return NaN;
  return (da.getTime() - db.getTime()) / 1000;
};

/* ─── Formatting helpers ─── */

/** Returns "YYYY-MM-DD" string (useful for <input type="date">) */
export const toDateString = (dateInput) => {
  const d = parseDate(dateInput);
  if (!d) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Returns start-of-day Date (midnight local) */
export const startOfDay = (dateInput) => {
  const d = parseDate(dateInput) || new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/** Returns end-of-day Date (23:59:59.999 local) */
export const endOfDay = (dateInput) => {
  const d = parseDate(dateInput) || new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

/* ─── Range helpers for filters ─── */

/** ISO string for N days ago from now */
export const daysAgo = (n) =>
  new Date(Date.now() - n * 86400000).toISOString();

/** ISO string for N days from now */
export const daysFromNow = (n) =>
  new Date(Date.now() + n * 86400000).toISOString();