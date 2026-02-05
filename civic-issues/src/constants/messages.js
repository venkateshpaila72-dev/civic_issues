/* ── Success messages ── */
export const SUCCESS = {
  // Auth
  LOGIN:              'Login successful',
  LOGOUT:             'Logged out successfully',
  REGISTER:           'Account created successfully',
  PASSWORD_RESET_SENT:'Password reset link sent to your email',
  PASSWORD_RESET:     'Password reset successfully',

  // Profile
  PROFILE_UPDATED:    'Profile updated successfully',
  IMAGE_UPLOADED:     'Profile image updated',

  // Reports
  REPORT_CREATED:     'Report submitted successfully',
  REPORT_STATUS:      'Report status updated successfully',
  REPORT_REJECTED:    'Report has been rejected',

  // Emergency
  EMERGENCY_CREATED:  'Emergency reported successfully',
  EMERGENCY_STATUS:   'Emergency status updated successfully',

  // Departments
  DEPT_CREATED:       'Department created successfully',
  DEPT_UPDATED:       'Department updated successfully',
  DEPT_DELETED:       'Department deleted successfully',
  DEPT_STATUS_TOGGLED:'Department status toggled successfully',

  // Officers
  OFFICER_CREATED:    'Officer created successfully',
  OFFICER_UPDATED:    'Officer updated successfully',
  OFFICER_DELETED:    'Officer deleted successfully',
  OFFICER_STATUS:     'Officer status updated successfully',
  DEPT_ASSIGNED:      'Department assigned successfully',
  DEPT_REMOVED:       'Department removed successfully',

  // Officer department selection
  DEPT_SELECTED:      'Department selected successfully',
};

/* ── Error / validation messages ── */
export const ERROR = {
  // Network
  NETWORK:            'Network error. Please check your connection.',
  TIMEOUT:            'Request timed out. Please try again.',
  UNKNOWN:            'Something went wrong. Please try again.',

  // Auth
  INVALID_CREDENTIALS:'Invalid email or password',
  TOKEN_EXPIRED:       'Session expired. Please log in again.',
  UNAUTHORIZED:        'Unauthorized access',
  ACCOUNT_INACTIVE:    'Your account is inactive. Contact support.',

  // Validation – generic
  REQUIRED:           (field) => `${field} is required`,
  MIN_LENGTH:         (field, n) => `${field} must be at least ${n} characters`,
  MAX_LENGTH:         (field, n) => `${field} must be at most ${n} characters`,
  INVALID_FORMAT:     (field) => `${field} format is invalid`,

  // Validation – specific
  INVALID_EMAIL:      'Enter a valid Gmail address',
  GMAIL_ONLY:         'Only Gmail addresses are allowed',
  PASSWORD_WEAK:      'Password must be at least 6 characters',
  PASSWORD_MISMATCH:  'Passwords do not match',
  PHONE_INVALID:      'Enter a valid phone number',

  // Files
  FILE_TYPE_INVALID:  'File type is not supported',
  FILE_TOO_LARGE:     (label) => `File exceeds the ${label} limit`,
  FILE_COUNT:         (type, max) => `You can upload at most ${max} ${type.toLowerCase()}(s)`,
  IMAGE_REQUIRED:     'At least one image is required',

  // Location
  LOCATION_REQUIRED:  'Location is required. Pick a point on the map or use GPS.',
  GEOLOCATION_DENIED: 'Geolocation permission denied. Pick a point on the map manually.',
  GEOLOCATION_ERROR:  'Could not determine your location. Please try again.',

  // Reports
  REPORT_NOT_FOUND:   'Report not found',
  INVALID_TRANSITION: 'This status change is not allowed',
  REJECT_REASON:      'A reason is required when rejecting a report',

  // Emergency
  EMERGENCY_NOT_FOUND:'Emergency not found',
  CONTACT_REQUIRED:   'Contact number is required for emergencies',

  // Departments / Officers
  DEPT_NOT_FOUND:     'Department not found',
  OFFICER_NOT_FOUND:  'Officer not found',
  DEPT_DUPLICATE:     'A department with this name already exists',
  OFFICER_DUPLICATE:  'An officer with this email already exists',
};