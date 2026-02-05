import { getFileCategory } from '../constants/fileTypes';

/* ─── Extension / type ─── */

/** "photo.jpg" → "jpg" */
export const getExtension = (fileName) => {
  const parts = String(fileName).split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

/** File object → 'IMAGE' | 'VIDEO' | 'AUDIO' | null */
export const categorize = (file) => getFileCategory(file?.type);

/* ─── Preview URL ─── */

/**
 * Returns a blob: URL for a local File.
 * Caller is responsible for revoking (URL.revokeObjectURL).
 */
export const createPreviewURL = (file) => {
  if (!file) return null;
  return URL.createObjectURL(file);
};

/** Revoke a previously created blob URL to free memory */
export const revokePreviewURL = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/* ─── Read as data-URL (base64) ─── */

/**
 * Returns a promise that resolves to a base64 data-URL string.
 * Useful for small image previews.
 */
export const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* ─── FormData builder helpers ─── */

/**
 * Append multiple files under the same field name.
 *   appendFiles(formData, 'images', fileArray)
 */
export const appendFiles = (formData, fieldName, files) => {
  (files || []).forEach((file) => formData.append(fieldName, file));
};

/**
 * Append location coordinates in the exact format the backend expects:
 *   location[coordinates][0] = longitude
 *   location[coordinates][1] = latitude
 */
export const appendLocation = (formData, { lat, lng }) => {
  formData.append('location[coordinates][0]', String(lng));  // longitude first (GeoJSON)
  formData.append('location[coordinates][1]', String(lat));
};