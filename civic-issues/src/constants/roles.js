export const USER_ROLES = {
  CITIZEN: 'citizen',
  OFFICER: 'officer',
  ADMIN:   'admin',
};

/* helper — returns true if the value is a valid role */
export const isValidRole = (role) => Object.values(USER_ROLES).includes(role);