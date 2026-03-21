import DiffRow from '../common/DiffRow';
import { computeProductDiff, computeBOMDiff } from '../../utils/diffUtils';
import { DIFF_COLORS, ECO_TYPES } from '../../utils/constants';

const changeLabel = {
  [DIFF_COLORS.ADDED]: '▲ Increase',
  [DIFF_COLORS.REDUCED]: '▼ Decrease',
  [DIFF_COLORS.UNCHANGED]: '= No change',
};
const changeColor = {
  [DIFF_COLORS.ADDED]: 'text-green-700',
  [DIFF_COLORS.REDUCED]: 'text-red-600',
  [DIFF_COLORS.UNCHANGED]: 'text-gray-500',
};

/**
 * ECODiff — renders side-by-side diff for Product or BOM ECOs.
 * @param {string} ecoType - 'Product' | 'BoM'
 * @param {Object} currentRecord - current Product or BOM document
 * @param {Object} proposedChanges - ECO.proposedChanges
 */
const ECODiff = ({ ecoType, currentRecord, proposedChanges }) => {
  if (!currentRecord || !proposedChanges) {
    return <p className="text-sm text-gray-400">No diff available.</p>;
  }

  if (ecoType === ECO_TYPES.PRODUCT) {
    const diff = computeProductDiff(currentRecord, proposedChanges);
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">📦 Product Field Changes</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
              <th className="px-4 py-2 text-left">Field</th>
              <th className="px-4 py-2 text-left">Current Value</th>
              <th className="px-4 py-2 text-left">Proposed Value</th>
            </tr>
          </thead>
          <tbody>
            {diff.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400 text-sm">No changes proposed.</td></tr>
            ) : (
              diff.map(({ field, oldValue, newValue }) => {
                const changed = JSON.stringify(oldValue) !== JSON.stringify(newValue);
                return (
                  <DiffRow key={field} changeType={changed ? DIFF_COLORS.ADDED : DIFF_COLORS.UNCHANGED}>
                    <DiffRow.Cell className="font-medium capitalize">{field}</DiffRow.Cell>
                    <DiffRow.Cell className="text-gray-500">{formatVal(oldValue)}</DiffRow.Cell>
                    <DiffRow.Cell className="font-semibold">{formatVal(newValue)}</DiffRow.Cell>
                  </DiffRow>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  }

  if (ecoType === ECO_TYPES.BOM) {
    const { components, operations } = computeBOMDiff(currentRecord, proposedChanges);
    return (
      <div className="space-y-4">
        {/* Component diff */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">🔧 Component Changes</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                <th className="px-4 py-2 text-left">Component</th>
                <th className="px-4 py-2 text-left">Old Qty</th>
                <th className="px-4 py-2 text-left">New Qty</th>
                <th className="px-4 py-2 text-left">Change</th>
              </tr>
            </thead>
            <tbody>
              {components.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No component changes.</td></tr>
              ) : (
                components.map((c) => (
                  <DiffRow key={c.componentId} changeType={c.changeType}>
                    <DiffRow.Cell className="font-medium">{c.componentName}</DiffRow.Cell>
                    <DiffRow.Cell>{c.oldQty ?? <span className="text-gray-400">—</span>}</DiffRow.Cell>
                    <DiffRow.Cell className="font-semibold">{c.newQty ?? <span className="text-red-500">Removed</span>}</DiffRow.Cell>
                    <DiffRow.Cell className={`text-xs font-medium ${changeColor[c.changeType]}`}>
                      {changeLabel[c.changeType]}
                    </DiffRow.Cell>
                  </DiffRow>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};

const formatVal = (val) => {
  if (val === null || val === undefined) return '—';
  if (Array.isArray(val)) return val.join(', ') || '—';
  if (typeof val === 'number') return val.toLocaleString();
  return String(val);
};

export default ECODiff;
