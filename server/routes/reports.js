const express = require('express');
const router = express.Router();
const {
  getECOReport, getVersionHistory, getBOMHistory,
  getArchived, getActiveMatrix, getAuditLog,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

router.use(protect);
// Reports accessible by engineering, approver, admin — not operations
router.use(requireRole(ROLES.ENGINEERING, ROLES.APPROVER, ROLES.ADMIN));

router.get('/eco',             getECOReport);
router.get('/version-history', getVersionHistory);
router.get('/bom-history',     getBOMHistory);
router.get('/archived',        getArchived);
router.get('/active-matrix',   getActiveMatrix);
router.get('/audit',           getAuditLog);

module.exports = router;
