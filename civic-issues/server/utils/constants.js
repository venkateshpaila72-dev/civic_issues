// User Roles
const USER_ROLES = {
  CITIZEN: 'citizen',
  OFFICER: 'officer',
  ADMIN: 'admin',
};

// Report Status
const REPORT_STATUS = {
  SUBMITTED: 'submitted',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

// Emergency Types
const EMERGENCY_TYPES = {
  POLICE: 'police',
  MEDICAL: 'medical',
  FIRE: 'fire',
  DISASTER: 'disaster',
};

// Emergency Status
const EMERGENCY_STATUS = {
  REPORTED: 'reported',
  RECEIVED: 'received',
  DISPATCHED: 'dispatched',
  RESOLVED: 'resolved',
};

// Account Status
const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// Media Types
const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
};

// Allowed File Extensions
const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  VIDEO: ['video/mp4', 'video/mpeg', 'video/quicktime'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/mp3'],
};

// File Size Limits (in bytes)
const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 50 * 1024 * 1024, // 50MB
  AUDIO: 10 * 1024 * 1024, // 10MB
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  TOKEN_REQUIRED: 'Authentication token required',
  INVALID_TOKEN: 'Invalid or expired token',
  MISSING_REQUIRED_FIELDS: 'Required fields are missing',
  
  // User errors
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  USER_INACTIVE: 'User account is inactive',
  
  // Role errors
  INVALID_ROLE: 'Invalid user role',
  ROLE_NOT_ALLOWED: 'This action is not allowed for your role',
  
  // Officer errors
  OFFICER_NOT_FOUND: 'Officer not found',
  DEPARTMENT_NOT_ASSIGNED: 'Officer not assigned to this department',
  DEPARTMENT_SELECTION_REQUIRED: 'Department selection required for officer login',
  INVALID_DEPARTMENT_ACCESS: 'Access denied: Invalid department',
  
  // Department errors
  DEPARTMENT_NOT_FOUND: 'Department not found',
  DEPARTMENT_ALREADY_EXISTS: 'Department already exists',
  DEPARTMENT_INACTIVE: 'Department is inactive',
  
  // Report errors
  REPORT_NOT_FOUND: 'Report not found',
  REPORT_ACCESS_DENIED: 'You do not have access to this report',
  INVALID_STATUS_TRANSITION: 'Invalid status transition',
  REJECTION_REASON_REQUIRED: 'Rejection reason is required',
  
  // Emergency errors
  EMERGENCY_NOT_FOUND: 'Emergency not found',
  INVALID_EMERGENCY_TYPE: 'Invalid emergency type',
  
  // Media errors
  MEDIA_REQUIRED: 'At least one image is required',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_TOO_LARGE: 'File size exceeds limit',
  UPLOAD_FAILED: 'File upload failed',
  
  // Location errors
  LOCATION_REQUIRED: 'Location coordinates are required',
  INVALID_COORDINATES: 'Invalid GPS coordinates',
  
  // Validation errors
  VALIDATION_ERROR: 'Validation error',
  REQUIRED_FIELD_MISSING: 'Required field missing',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',
};

// Success Messages
const SUCCESS_MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  
  // User
  PROFILE_UPDATED: 'Profile updated successfully',
  
  // Officer
  OFFICER_CREATED: 'Officer created successfully',
  OFFICER_UPDATED: 'Officer updated successfully',
  DEPARTMENT_ASSIGNED: 'Department assigned successfully',
  DEPARTMENT_REMOVED: 'Department removed successfully',
  
  // Department
  DEPARTMENT_CREATED: 'Department created successfully',
  DEPARTMENT_UPDATED: 'Department updated successfully',
  DEPARTMENT_DELETED: 'Department deleted successfully',
  
  // Report
  REPORT_CREATED: 'Report submitted successfully',
  REPORT_UPDATED: 'Report updated successfully',
  STATUS_UPDATED: 'Report status updated successfully',
  
  // Emergency
  EMERGENCY_CREATED: 'Emergency reported successfully',
  EMERGENCY_UPDATED: 'Emergency status updated successfully',
};

// Pagination Defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Rate Limiting
const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // max requests per window
};

// Token Expiry
const TOKEN_EXPIRY = {
  ACCESS_TOKEN: '7d', // 7 days
  REFRESH_TOKEN: '30d', // 30 days
};

// Cloudinary Folders
const CLOUDINARY_FOLDERS = {
  REPORTS: 'civic-reports',
  EMERGENCIES: 'civic-emergencies',
  PROFILES: 'civic-profiles',
};

module.exports = {
  USER_ROLES,
  REPORT_STATUS,
  EMERGENCY_TYPES,
  EMERGENCY_STATUS,
  ACCOUNT_STATUS,
  MEDIA_TYPES,
  ALLOWED_FILE_TYPES,
  FILE_SIZE_LIMITS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  RATE_LIMIT,
  TOKEN_EXPIRY,
  CLOUDINARY_FOLDERS,
};