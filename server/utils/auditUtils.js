const AuditLog = require('../models/AuditLog');

/**
 * Write an immutable audit log entry to the database.
 * @param {Object} params
 * @param {string} params.action        - One of AUDIT_ACTIONS constants
 * @param {string} params.affectedModel - 'ECO' | 'Product' | 'BOM'
 * @param {*}      params.affectedId    - ObjectId of the affected document
 * @param {*}      [params.oldValue]    - Previous state (optional)
 * @param {*}      [params.newValue]    - New state (optional)
 * @param {*}      params.userId        - ObjectId of the user performing the action
 */
const logAudit = async ({
  action,
  affectedModel,
  affectedId,
  oldValue = null,
  newValue = null,
  userId,
}) => {
  try {
    await AuditLog.create({
      action,
      affectedModel,
      affectedId,
      oldValue,
      newValue,
      performedBy: userId,
      timestamp: new Date(),
    });
  } catch (err) {
    // Audit failures must not break the main operation — log silently
    console.error('Audit log error:', err.message);
  }
};

module.exports = { logAudit };
