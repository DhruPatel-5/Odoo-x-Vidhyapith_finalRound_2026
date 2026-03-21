const express = require('express');
const router = express.Router();
const {
  getProducts, getProductById, getProductHistory,
  createProduct, updateProduct, archiveProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

router.use(protect);

router.get('/',    getProducts);
router.get('/:id/history', getProductHistory);
router.get('/:id', getProductById);
router.post('/',   requireRole(ROLES.ENGINEERING, ROLES.ADMIN), createProduct);
router.put('/:id', requireRole(ROLES.ENGINEERING, ROLES.ADMIN), updateProduct);
router.delete('/:id', requireRole(ROLES.ADMIN), archiveProduct);

module.exports = router;
