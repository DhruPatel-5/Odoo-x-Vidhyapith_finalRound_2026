import { ROLES, MODULES } from './constants';

/**
 * Centralized role-based access guard.
 * All UI permission checks MUST use these functions — never inline string comparisons.
 */

/**
 * Can the user create records in the given module?
 * @param {string} role
 * @param {string} module - one of MODULES
 * @returns {boolean}
 */
export const canCreate = (role, module) => {
  if (role === ROLES.ADMIN) return true;
  if (role === ROLES.OPERATIONS) return false;
  if (role === ROLES.APPROVER) return false;
  // engineering can create products, bom, eco
  if (role === ROLES.ENGINEERING) {
    return [MODULES.PRODUCTS, MODULES.BOM, MODULES.ECO].includes(module);
  }
  return false;
};

/**
 * Can the user edit records in the given module?
 * @param {string} role
 * @param {string} module
 * @returns {boolean}
 */
export const canEdit = (role, module) => {
  if (role === ROLES.ADMIN) return true;
  if (role === ROLES.OPERATIONS || role === ROLES.APPROVER) return false;
  if (role === ROLES.ENGINEERING) {
    return [MODULES.PRODUCTS, MODULES.BOM, MODULES.ECO].includes(module);
  }
  return false;
};

/**
 * Can the user approve ECOs?
 * @param {string} role
 * @returns {boolean}
 */
export const canApprove = (role) => {
  return role === ROLES.APPROVER || role === ROLES.ADMIN;
};

/**
 * Can the user validate (move ECO to next stage)?
 * @param {string} role
 * @returns {boolean}
 */
export const canValidate = (role) => {
  return role === ROLES.ENGINEERING || role === ROLES.ADMIN;
};

/**
 * Can the user see the Settings page?
 * @param {string} role
 * @returns {boolean}
 */
export const canManageSettings = (role) => role === ROLES.ADMIN;

/**
 * Can the user see Reports?
 * @param {string} role
 * @returns {boolean}
 */
export const canViewReports = (role) => role !== ROLES.OPERATIONS;

/**
 * Can the user see ECOs?
 * @param {string} role
 * @returns {boolean}
 */
export const canViewECO = (role) => role !== ROLES.OPERATIONS;

/**
 * Can the user archive (delete) records?
 * @param {string} role
 * @returns {boolean}
 */
export const canArchive = (role) => role === ROLES.ADMIN;
