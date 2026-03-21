const Product = require('../models/Product');
const { STATUS_VALUES, ROLES } = require('../config/constants');

/**
 * GET /api/products
 * operations role: Active only. Others: all records.
 */
const getProducts = async (req, res) => {
  const filter =
    req.user.role === ROLES.OPERATIONS ? { status: STATUS_VALUES.ACTIVE } : {};
  const products = await Product.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
  res.json(products);
};

/**
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'createdBy',
    'name email'
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

/**
 * GET /api/products/:id/history
 * Returns all versions of a product (by rootProduct or self).
 */
const getProductHistory = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const rootId = product.rootProduct || product._id;
  const history = await Product.find({
    $or: [{ _id: rootId }, { rootProduct: rootId }],
  })
    .sort({ createdAt: 1 })
    .populate('createdBy', 'name');
  res.json(history);
};

/**
 * POST /api/products
 * Body: { name, salePrice, costPrice, attachments }
 */
const createProduct = async (req, res) => {
  const { name, salePrice, costPrice, attachments } = req.body;
  const product = await Product.create({
    name,
    salePrice,
    costPrice,
    attachments: attachments || [],
    version: 'v1',
    status: STATUS_VALUES.ACTIVE,
    createdBy: req.user._id,
  });
  res.status(201).json(product);
};

/**
 * PUT /api/products/:id
 * Only allowed on Active products by engineering/admin.
 */
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.status === STATUS_VALUES.ARCHIVED) {
    return res.status(400).json({ message: 'Cannot edit an Archived product' });
  }

  const { name, salePrice, costPrice, attachments } = req.body;
  if (name !== undefined) product.name = name;
  if (salePrice !== undefined) product.salePrice = salePrice;
  if (costPrice !== undefined) product.costPrice = costPrice;
  if (attachments !== undefined) product.attachments = attachments;

  await product.save();
  res.json(product);
};

/**
 * DELETE /api/products/:id
 * Archives the product (soft delete). Admin only.
 */
const archiveProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  product.status = STATUS_VALUES.ARCHIVED;
  await product.save();
  res.json({ message: 'Product archived', product });
};

module.exports = {
  getProducts,
  getProductById,
  getProductHistory,
  createProduct,
  updateProduct,
  archiveProduct,
};
