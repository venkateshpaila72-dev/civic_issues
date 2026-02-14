/* ─────────────────────────────────────────────
   All 45 backend endpoints — single source of truth.
   Import from here; never hard-code a URL elsewhere.
   ───────────────────────────────────────────── */

/* ── Auth  (7) ── */
export const AUTH = {
  REGISTER:        '/auth/register',
  LOGIN:           '/auth/login',
  GOOGLE:          '/auth/google',          // initiates OAuth redirect
  GOOGLE_CALLBACK: '/auth/google/callback', // handled server-side; kept for reference
  ME:              '/auth/me',
  LOGOUT:          '/auth/logout',
  REFRESH:         '/auth/refresh',
};

/* ── Departments  (8) ── */
export const DEPARTMENTS = {
  CREATE:        '/departments',            // POST  /
  LIST:          '/departments',            // GET   /
  ACTIVE:        '/departments/active',     // GET   /active
  BY_ID:         (id) => `/departments/${id}`,           // GET | PUT | DELETE
  TOGGLE_STATUS: (id) => `/departments/${id}/toggle-status`, // PATCH
  STATS:         (id) => `/departments/${id}/stats`,         // GET
};

/* ── Admin  (9) ── */
export const ADMIN = {
  CREATE_OFFICER:           '/admin/officers',                                        // POST
  LIST_OFFICERS:            '/admin/officers',                                        // GET
  OFFICER_BY_ID:            (id)             => `/admin/officers/${id}`,              // GET | PUT | DELETE
  OFFICER_STATUS:           (id)             => `/admin/officers/${id}/status`,       // PATCH
  ASSIGN_DEPARTMENT:        (officerId)      => `/admin/officers/${officerId}/departments`,                        // POST
  REMOVE_DEPARTMENT:        (officerId, deptId) => `/admin/officers/${officerId}/departments/${deptId}`,           // DELETE
  REPORTS_AUDIT:            '/admin/reports',                                         // GET (FIXED NAME)
  EMERGENCY_OVR:            '/admin/emergencies',                                     // GET (ADDED)
  DASHBOARD:                '/admin/dashboard',
};

/* ── Officer  (9) ── */
export const OFFICER = {
  SELECT_DEPARTMENT:  '/officer/select-department',                         // POST
  DASHBOARD:          '/officer/dashboard',                                 // GET
  REPORTS:            '/officer/reports',                                   // GET
  REPORT_BY_ID:       (id) => `/officer/reports/${id}`,                     // GET
  REPORT_STATUS:      (id) => `/officer/reports/${id}/status`,              // PATCH
  REPORT_REJECT:      (id) => `/officer/reports/${id}/reject`,             // POST
  EMERGENCIES:        '/officer/emergencies',                               // GET
  PROFILE:            '/officer/profile',                                   // GET | PUT
};

/* ── Citizen  (6) ── */
export const CITIZEN = {
  DASHBOARD:    '/citizen/dashboard',           // GET
  CREATE_REPORT:'/citizen/reports',             // POST  (multipart)
  MY_REPORTS:   '/citizen/reports',             // GET
  REPORT_BY_ID: (id) => `/citizen/reports/${id}`, // GET
  PROFILE:      '/citizen/profile',             // GET | PUT  (multipart for image)
};

/* ── Emergency  (5) ── */
export const EMERGENCY = {
  CREATE:         '/emergency',                      // POST  (multipart)
  MY_EMERGENCIES: '/emergency/my-emergencies',      // GET
  ACTIVE:         '/emergency/active',              // GET
  BY_ID:          (id) => `/emergency/${id}`,       // GET
  STATUS:         (id) => `/emergency/${id}/status`, // PATCH
};

/* ── Reports  (4) — shared, role-filtered server-side ── */
export const REPORTS = {
  LIST:       '/reports',                    // GET   (with query params)
  BY_ID:      (id) => `/reports/${id}`,      // GET
  STATISTICS: '/reports/statistics',         // GET
  NEARBY:     '/reports/nearby',            // GET   (lat, lng, radius)
};

/* ── Health ── */
export const HEALTH = '/health';