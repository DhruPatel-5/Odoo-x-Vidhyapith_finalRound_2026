const express = require('express');
const router = express.Router();
const {
  getECOs, getECOById, createECO, updateECO,
  validateECO, approveECO, applyECO,
} = require('../controllers/ecoController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

router.use(protect);

router.get('/',    requireRole(ROLES.ENGINEERING, ROLES.APPROVER, ROLES.ADMIN), getECOs);
router.get('/:id', requireRole(ROLES.ENGINEERING, ROLES.APPROVER, ROLES.ADMIN), getECOById);
router.post('/',   requireRole(ROLES.ENGINEERING, ROLES.ADMIN), createECO);
router.put('/:id', requireRole(ROLES.ENGINEERING, ROLES.ADMIN), updateECO);
router.post('/:id/validate', requireRole(ROLES.ENGINEERING, ROLES.ADMIN), validateECO);
router.post('/:id/approve',  requireRole(ROLES.APPROVER, ROLES.ADMIN), approveECO);
router.post('/:id/apply',    requireRole(ROLES.ADMIN), applyECO);

module.exports = router;
