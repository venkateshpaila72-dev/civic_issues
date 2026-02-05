/* ─── Public routes ─── */
export const PUBLIC_ROUTES = {
  LANDING:        '/',
  ABOUT:          '/about',
  CONTACT:        '/contact',
};

/* ─── Auth routes ─── */
export const AUTH_ROUTES = {
  LOGIN:          '/login',
  REGISTER:       '/register',
  FORGOT_PW:      '/forgot-password',
  RESET_PW:       '/reset-password',
  OAUTH_SUCCESS:  '/oauth-success',   // Google OAuth redirect lands here
};

/* ─── Citizen routes ─── */
export const CITIZEN_ROUTES = {
  DASHBOARD:       '/citizen/dashboard',
  CREATE_REPORT:   '/citizen/reports/create',
  MY_REPORTS:      '/citizen/reports',
  REPORT_DETAIL:   (id) => `/citizen/reports/${id}`,
  CREATE_EMERGENCY:'/citizen/emergencies/create',
  MY_EMERGENCIES:  '/citizen/emergencies',
  NEARBY_REPORTS:  '/citizen/nearby',
  PROFILE:         '/citizen/profile',
};

/* ─── Officer routes ─── */
export const OFFICER_ROUTES = {
  DEPT_SELECT:     '/officer/select-department',
  DASHBOARD:       '/officer/dashboard',
  DEPT_REPORTS:    '/officer/reports',
  REPORT_DETAIL:   (id) => `/officer/reports/${id}`,
  EMERGENCIES:     '/officer/emergencies',
  STATISTICS:      '/officer/statistics',
  PROFILE:         '/officer/profile',
};

/* ─── Admin routes ─── */
export const ADMIN_ROUTES = {
  DASHBOARD:       '/admin/dashboard',
  DEPARTMENTS:     '/admin/departments',
  OFFICERS:        '/admin/officers',
  CREATE_OFFICER:  '/admin/officers/create',
  EDIT_OFFICER:    (id) => `/admin/officers/${id}/edit`,
  REPORTS_AUDIT:   '/admin/reports',
  EMERGENCY_OVR:   '/admin/emergencies',
};

/* ─── Error routes ─── */
export const ERROR_ROUTES = {
  NOT_FOUND:       '/404',
  UNAUTHORIZED:    '/unauthorized',
  SERVER_ERROR:    '/error',
};

/* ─── localStorage key constants (used by axios.js, AuthContext, storage util) ─── */
export const STORAGE_KEYS = {
  TOKEN:            'civic_token',
  USER:             'civic_user',
  SELECTED_DEPT:    'civic_officer_dept',   // officer's active department ID
  THEME:            'civic_theme',          // 'light' | 'dark'
};