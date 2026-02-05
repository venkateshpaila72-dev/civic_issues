import { USER_ROLES } from '../constants/roles';

/* ─── Role checks ─── */

export const isCitizen = (user) => user?.role === USER_ROLES.CITIZEN;
export const isOfficer = (user) => user?.role === USER_ROLES.OFFICER;
export const isAdmin   = (user) => user?.role === USER_ROLES.ADMIN;

/** Does the user's role appear in the allowed-roles array? */
export const hasRole = (user, roles) => {
  if (!user?.role) return false;
  const allowed = Array.isArray(roles) ? roles : [roles];
  return allowed.includes(user.role);
};

/* ─── Route-level guards (return true → allow, false → block) ─── */

/**
 * Officer must have an active department selection before
 * accessing any officer page except the department-selection page itself.
 */
export const officerCanAccess = (user, selectedDeptId) => {
  if (!isOfficer(user)) return true;   // not an officer — not this guard's job
  return Boolean(selectedDeptId);      // officer needs a dept
};

/* ─── Feature-level helpers ─── */

/** Can this user create a report? (citizens only) */
export const canCreateReport = (user) => isCitizen(user);

/** Can this user update a report's status? (officers only) */
export const canUpdateReportStatus = (user) => isOfficer(user);

/** Can this user manage departments? (admins only) */
export const canManageDepartments = (user) => isAdmin(user);

/** Can this user manage officers? (admins only) */
export const canManageOfficers = (user) => isAdmin(user);

/** Can this user see the audit reports view? (admins only) */
export const canAuditReports = (user) => isAdmin(user);

/** Can this user create an emergency? (citizens only) */
export const canCreateEmergency = (user) => isCitizen(user);

/** Can this user update emergency status? (officers & admins) */
export const canUpdateEmergencyStatus = (user) =>
  isOfficer(user) || isAdmin(user);

/* ─── Default redirect after login by role ─── */
export const getDefaultDashboard = (user) => {
  switch (user?.role) {
    case USER_ROLES.ADMIN:   return '/admin/dashboard';
    case USER_ROLES.OFFICER: return '/officer/select-department'; // must pick dept first
    case USER_ROLES.CITIZEN: return '/citizen/dashboard';
    default:                 return '/';
  }
};