/* ─── Date / time ─── */

/**
 * "2 hours ago", "3 days ago" … mirrors backend getTimeAgo()
 */
export const timeAgo = (dateInput) => {
  const seconds = Math.floor((Date.now() - new Date(dateInput)) / 1000);

  const intervals = [
    { unit: 'year',   secs: 31536000 },
    { unit: 'month',  secs: 2592000  },
    { unit: 'day',    secs: 86400    },
    { unit: 'hour',   secs: 3600     },
    { unit: 'minute', secs: 60       },
  ];

  for (const { unit, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

/**
 * Full readable date: "03 Feb 2026"
 */
export const formatDate = (dateInput, opts = {}) => {
  const d = new Date(dateInput);
  return d.toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
    ...opts,
  });
};

/**
 * Date + time: "03 Feb 2026, 2:45 PM"
 */
export const formatDateTime = (dateInput) => {
  const d = new Date(dateInput);
  return d.toLocaleString('en-IN', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * ISO string only — useful for <time> elements
 */
export const toISO = (dateInput) => new Date(dateInput).toISOString();

/* ─── File size ─── (mirrors backend formatFileSize) */

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k    = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i    = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

/* ─── Phone ─── */

/**
 * "9876543210" → "+91 98765 43210"  (Indian default prefix)
 */
export const formatPhone = (phone, countryCode = '+91') => {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) {
    return `${countryCode} ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone; // return raw if unexpected length
};

/* ─── Numbers ─── */

/**
 * 1234567 → "12,34,567"  (Indian numbering)
 */
export const formatNumber = (num) =>
  Number(num).toLocaleString('en-IN');

/* ─── Truncation ─── */

export const truncate = (str, maxLen = 80) =>
  str && str.length > maxLen ? str.slice(0, maxLen - 3) + '…' : str;