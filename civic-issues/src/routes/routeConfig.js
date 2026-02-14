import { USER_ROLES } from '../constants/roles';

/**
 * Route configuration object — defines which roles can access which paths.
 * Used by AppRoutes.jsx to automatically apply ProtectedRoute + RoleBasedRoute.
 */
export const routeConfig = {
  /* ─── Public (no auth required) ─── */
  public: [
    '/',
    '/about',
    '/contact',
  ],

  /* ─── Auth pages (accessible only when NOT logged in) ─── */
  auth: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/oauth-success',
  ],

  /* ─── Error pages (accessible to all) ─── */
  error: [
    '/404',
    '/unauthorized',
    '/error',
  ],

  /* ─── Citizen routes ─── */
  citizen: {
    role: USER_ROLES.CITIZEN,
    paths: [
      '/citizen/dashboard',
      '/citizen/reports',
      '/citizen/reports/create',
      '/citizen/reports/:id',
      '/citizen/emergencies',
      '/citizen/emergencies/create',
      '/citizen/nearby',
      '/citizen/profile',
    ],
  },

  /* ─── Officer routes ─── */
  officer: {
    role: USER_ROLES.OFFICER,
    paths: [
      '/officer/select-department',
      '/officer/dashboard',
      '/officer/reports',
      '/officer/reports/:id',
      '/officer/emergencies',
      '/officer/statistics',
      '/officer/profile',
    ],
  },

  /* ─── Admin routes ─── */
  admin: {
    role: USER_ROLES.ADMIN,
    paths: [
      '/admin/dashboard',
      '/admin/departments',
      '/admin/officers',
      '/admin/officers/create',
      '/admin/officers/:id/edit',
      '/admin/reports',
      '/admin/reports/:id',
      '/admin/emergencies',
    ],
  },
};

/**
 * Helper: returns true if the given path requires authentication.
 */
export const isProtectedPath = (path) => {
  const { public: publicPaths, auth: authPaths, error: errorPaths } = routeConfig;
  return (
    !publicPaths.includes(path) &&
    !authPaths.includes(path) &&
    !errorPaths.includes(path)
  );
};

/**
 * Helper: returns the required role for a path (or null if public/auth/error).
 */
export const getRequiredRole = (path) => {
  for (const [key, config] of Object.entries(routeConfig)) {
    if (config?.role && config?.paths?.some((p) => matchPath(p, path))) {
      return config.role;
    }
  }
  return null;
};

/* Simple path matcher (handles :id params) */
const matchPath = (pattern, path) => {
  const regex = new RegExp(`^${pattern.replace(/:\w+/g, '[^/]+')}$`);
  return regex.test(path);
};