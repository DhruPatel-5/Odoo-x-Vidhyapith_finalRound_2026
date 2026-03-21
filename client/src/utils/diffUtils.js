import { DIFF_COLORS } from './constants';

/**
 * Compute diff between current Product fields and proposedChanges.
 * @param {Object} oldProduct - Current product document
 * @param {Object} proposedChanges - proposedChanges from ECO
 * @returns {{ field: string, oldValue: *, newValue: * }[]}
 */
export const computeProductDiff = (oldProduct, proposedChanges) => {
  if (!oldProduct || !proposedChanges) return [];
  const fields = ['name', 'salePrice', 'costPrice', 'attachments'];
  return fields
    .filter((f) => proposedChanges[f] !== undefined)
    .map((f) => ({
      field: f,
      oldValue: oldProduct[f],
      newValue: proposedChanges[f],
    }));
};

/**
 * Compute diff between current BOM components and proposed components.
 * @param {Object} oldBOM - Current BOM document (with populated components.product)
 * @param {Object} proposedChanges - { components: [{product, quantity}], operations: [...] }
 * @returns {{ componentId: string, componentName: string, oldQty: number|null, newQty: number|null, changeType: string }[]}
 */
export const computeBOMDiff = (oldBOM, proposedChanges) => {
  if (!oldBOM || !proposedChanges) return { components: [], operations: [] };

  const oldComponents = oldBOM.components || [];
  const newComponents = proposedChanges.components || [];

  // Build maps by product id
  const oldMap = {};
  for (const c of oldComponents) {
    const id = c.product?._id || c.product;
    oldMap[id] = { qty: c.quantity, name: c.product?.name || id };
  }

  const newMap = {};
  for (const c of newComponents) {
    const id = c.product?._id || c.product;
    newMap[id] = { qty: c.quantity, name: c.product?.name || id };
  }

  const allIds = new Set([...Object.keys(oldMap), ...Object.keys(newMap)]);
  const componentDiff = [];

  for (const id of allIds) {
    const oldEntry = oldMap[id];
    const newEntry = newMap[id];
    const oldQty = oldEntry ? oldEntry.qty : null;
    const newQty = newEntry ? newEntry.qty : null;
    // Prefer oldMap name (populated from DB) since proposed changes only store raw IDs
    const name = oldEntry?.name || newEntry?.name || id;

    let changeType = DIFF_COLORS.UNCHANGED;
    if (oldQty === null) changeType = DIFF_COLORS.ADDED;
    else if (newQty === null) changeType = DIFF_COLORS.REDUCED;
    else if (newQty > oldQty) changeType = DIFF_COLORS.ADDED;
    else if (newQty < oldQty) changeType = DIFF_COLORS.REDUCED;

    componentDiff.push({ componentId: id, componentName: name, oldQty, newQty, changeType });
  }

  // Operations diff (simple change detection)
  const oldOps = oldBOM.operations || [];
  const newOps = proposedChanges.operations || [];

  return { components: componentDiff, operations: { old: oldOps, new: newOps } };
};
