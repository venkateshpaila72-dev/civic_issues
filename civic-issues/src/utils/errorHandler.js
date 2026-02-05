import { ERROR } from '../constants/messages';

/**
 * Given an Axios error (or any thrown value), return a
 * human-readable message string.
 *
 * Server response shapes we handle:
 *   { success: false, message: '...' }                  ← most controllers
 *   { success: false, errors: [ { message: '...' } ] }  ← validation middleware
 */
export const getErrorMessage = (error) => {
  // Network / timeout — no response at all
  if (!error?.response) {
    if (error?.code === 'ECONNABORTED') return ERROR.TIMEOUT;
    return ERROR.NETWORK;
  }

  const { data, status } = error.response;

  // 401 — always the same user-facing copy
  if (status === 401) return ERROR.TOKEN_EXPIRED;

  // Try the top-level message first
  if (data?.message && typeof data.message === 'string') {
    return data.message;
  }

  // Validation array from validationMiddleware
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors[0].message || ERROR.UNKNOWN;
  }

  // Fallback by status
  switch (status) {
    case 400: return 'Bad request. Please check your input.';
    case 403: return ERROR.UNAUTHORIZED;
    case 404: return 'Resource not found.';
    case 409: return 'Conflict — this resource already exists.';
    case 429: return 'Too many requests. Please wait a moment.';
    case 500: return ERROR.UNKNOWN;
    default:  return ERROR.UNKNOWN;
  }
};

/**
 * Console-log the error in development only, then return the message.
 * Drop-in replacement: const msg = logError(err);
 */
export const logError = (error, context = '') => {
  if (import.meta.env.DEV) {
    console.error(`[${context || 'error'}]`, error);
  }
  return getErrorMessage(error);
};