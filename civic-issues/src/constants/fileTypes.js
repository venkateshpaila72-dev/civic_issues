/* ─── MIME types ─── (mirrors backend ALLOWED_FILE_TYPES) */
export const ALLOWED_MIME_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  VIDEO: ['video/mp4', 'video/mpeg', 'video/quicktime'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/mp3'],
};

/* ─── Size limits in bytes ─── (mirrors backend FILE_SIZE_LIMITS) */
export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024,  // 10 MB
  VIDEO: 50 * 1024 * 1024,  // 50 MB
  AUDIO: 10 * 1024 * 1024,  // 10 MB
};

/* Human-readable labels */
export const FILE_SIZE_LABELS = {
  IMAGE: '10 MB',
  VIDEO: '50 MB',
  AUDIO: '10 MB',
};

/* Max number of files per type allowed by the backend */
export const FILE_COUNT_LIMITS = {
  IMAGE: 5,
  VIDEO: 2,
  AUDIO: 2,
};

/* File-input accept strings for <input type="file"> */
export const ACCEPT_STRINGS = {
  IMAGE: ALLOWED_MIME_TYPES.IMAGE.join(','),
  VIDEO: ALLOWED_MIME_TYPES.VIDEO.join(','),
  AUDIO: ALLOWED_MIME_TYPES.AUDIO.join(','),
  ALL:   [...ALLOWED_MIME_TYPES.IMAGE, ...ALLOWED_MIME_TYPES.VIDEO, ...ALLOWED_MIME_TYPES.AUDIO].join(','),
};

/** Quick helper: return the category ('IMAGE' | 'VIDEO' | 'AUDIO' | null) for a MIME string */
export const getFileCategory = (mimeType) => {
  if (ALLOWED_MIME_TYPES.IMAGE.includes(mimeType)) return 'IMAGE';
  if (ALLOWED_MIME_TYPES.VIDEO.includes(mimeType)) return 'VIDEO';
  if (ALLOWED_MIME_TYPES.AUDIO.includes(mimeType)) return 'AUDIO';
  return null;
};