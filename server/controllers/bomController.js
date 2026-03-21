const BOM = require('../models/BOM');
const { STATUS_VALUES, ROLES } = require('../config/constants');

/**
 * GET /api/bom
 * operations role: Active only. Others: all.
 */
const getBOMs = async (req, res) => {
  const filter =
    req.user.role === ROLES.OPERATIONS ? { status: STATUS_VALUES.ACTIVE } : {};
  const boms = await BOM.find(filter)
    .populate('product', 'name version status')
    .populate('components.product', 'name version')
    .sort({ createdAt: -1 });
  res.json(boms);
};

/**
 * GET /api/bom/:id
 */
const getBOMById = async (req, res) => {
  const bom = await BOM.findById(req.params.id)
    .populate('product', 'name version status')
    .populate('components.product', 'name version status');
  if (!bom) return res.status(404).json({ message: 'BOM not found' });
  res.json(bom);
};

/**
 * GET /api/bom/:id/history
 * All versions of a BOM (by rootBOM).
 */
const getBOMHistory = async (req, res) => {
  const bom = await BOM.findById(req.params.id);
  if (!bom) return res.status(404).json({ message: 'BOM not found' });

  const rootId = bom.rootBOM || bom._id;
  const history = await BOM.find({
    $or: [{ _id: rootId }, { rootBOM: rootId }],
  })
    .populate('product', 'name version')
    .sort({ createdAt: 1 });
  res.json(history);
};

/**
 * POST /api/bom
 * Body: { product, components: [{product, quantity}], operations: [{name, duration, workCenter}] }
 */
const createBOM = async (req, res) => {
  const { product, components, operations } = req.body;
  const bom = await BOM.create({
    product,
    components: components || [],
    operations: operations || [],
    version: 'v1',
    status: STATUS_VALUES.ACTIVE,
  });
  const populated = await bom.populate('product', 'name version');
  res.status(201).json(populated);
};

/**
 * PUT /api/bom/:id
 * Update components/operations directly (no versioning — that goes through ECO).
 */
const updateBOM = async (req, res) => {
  const bom = await BOM.findById(req.params.id);
  if (!bom) return res.status(404).json({ message: 'BOM not found' });
  if (bom.status === STATUS_VALUES.ARCHIVED) {
    return res.status(400).json({ message: 'Cannot edit an Archived BOM' });
  }

  const { components, operations } = req.body;
  if (components !== undefined) bom.components = components;
  if (operations !== undefined) bom.operations = operations;

  await bom.save();
  res.json(bom);
};

module.exports = { getBOMs, getBOMById, getBOMHistory, createBOM, updateBOM };
