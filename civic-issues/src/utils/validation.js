import { ALLOWED_MIME_TYPES, FILE_SIZE_LIMITS, getFileCategory } from '../constants/fileTypes';

/* ─── Basic field validators ─── */

/** Not empty after trim */
export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim().length > 0;

/** Minimum length */
export const minLength = (value, min) =>
  String(value).trim().length >= min;

/** Maximum length */
export const maxLength = (value, max) =>
  String(value).trim().length <= max;

/* ─── Email ─── */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valid email format */
export const isValidEmail = (email) => EMAIL_REGEX.test(String(email));

/** Gmail-only (backend enforces this too) */
export const isGmail = (email) =>
  String(email).toLowerCase().endsWith('@gmail.com');

/* ─── Password ─── */

/** At least 6 characters */
export const isValidPassword = (pw) => String(pw).length >= 6;

/** Passwords match */
export const passwordsMatch = (pw, confirm) => pw === confirm;

/* ─── Phone ─── */
const PHONE_REGEX = /^[0-9]{10,15}$/;

/** 10-15 digits (after stripping non-digits) */
export const isValidPhone = (phone) =>
  PHONE_REGEX.test(String(phone).replace(/\D/g, ''));

/* ─── Coordinates ─── */

export const isValidCoordinates = (lat, lng) => {
  const la = parseFloat(lat);
  const lo = parseFloat(lng);
  return !isNaN(la) && !isNaN(lo) && la >= -90 && la <= 90 && lo >= -180 && lo <= 180;
};

/* ─── File validation ─── */

/**
 * Check a single File object against allowed types + size.
 * Returns { valid: true } or { valid: false, error: string }
 */
export const validateFile = (file) => {
  const category = getFileCategory(file.type);

  if (!category) {
    return { valid: false, error: 'File type is not supported' };
  }

  if (file.size > FILE_SIZE_LIMITS[category]) {
    const label = category === 'VIDEO' ? '50 MB' : '10 MB';
    return { valid: false, error: `File exceeds the ${label} limit` };
  }

  return { valid: true };
};

/**
 * Validate an array of Files – returns the first error or null.
 */
export const validateFiles = (files) => {
  for (const file of files) {
    const result = validateFile(file);
    if (!result.valid) return result.error;
  }
  return null;
};

/* ─── Convenience: run a rules map and return errors object ─── */
/**
 * rules = { fieldName: [ { test: (val) => bool, message: string } ] }
 * values = { fieldName: value }
 * Returns { fieldName: errorMessage } for the FIRST failing rule per field.
 */
export const validate = (rules, values) => {
  const errors = {};
  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const { test, message } of fieldRules) {
      if (!test(values[field])) {
        errors[field] = message;
        break; // first error only per field
      }
    }
  }
  return errors; // empty object = no errors
};