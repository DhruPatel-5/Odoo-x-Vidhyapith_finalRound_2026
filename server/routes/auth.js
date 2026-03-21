const express = require('express');
const router = express.Router();
const { signup, login, me, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, me);
router.get('/users', protect, requireRole(ROLES.ADMIN), getAllUsers);

module.exports = router;
