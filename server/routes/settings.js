const express = require('express');
const router = express.Router();
const {
  getStages, createStage, updateStage, deleteStage,
  getRules, createRule, deleteRule,
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

router.use(protect);

// Stages
router.get('/stages',       getStages);                                    // any authenticated
router.post('/stages',      requireRole(ROLES.ADMIN), createStage);
router.put('/stages/:id',   requireRole(ROLES.ADMIN), updateStage);
router.delete('/stages/:id',requireRole(ROLES.ADMIN), deleteStage);

// Approval Rules
router.get('/rules',        getRules);
router.post('/rules',       requireRole(ROLES.ADMIN), createRule);
router.delete('/rules/:id', requireRole(ROLES.ADMIN), deleteRule);

module.exports = router;
