import { DIFF_COLORS, ECO_TYPES } from '../../utils/constants';
import { computeProductDiff, computeBOMDiff } from '../../utils/diffUtils';

const ROW_STYLES = {
  [DIFF_COLORS.ADDED]:     { background: '#EAF3DE', borderLeft: '3px solid #3B6D11', color: '#27500A' },
  [DIFF_COLORS.REDUCED]:   { background: '#FCEBEB', borderLeft: '3px solid #A32D2D', color: '#791F1F' },
  [DIFF_COLORS.UNCHANGED]: { background: '#F5FBFF', borderLeft: '3px solid #CAF0F8', color: '#03045E' },
};

const CHANGE_LABEL = {
  [DIFF_COLORS.ADDED]:     '▲ Increase',
  [DIFF_COLORS.REDUCED]:   '▼ Decrease',
  [DIFF_COLORS.UNCHANGED]: '= No change',
};

const DiffTable = ({ children, headers }) => (
  <div style={{ background: '#FFFFFF', border: '1.5px solid #90E0EF', borderRadius: 12, overflow: 'hidden' }}>
    <div style={{ padding: '10px 14px', background: '#EAF6FB', borderBottom: '1.5px solid #CAF0F8' }}>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#03045E' }}>{headers}</p>
    </div>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr>
          {['Component', 'Old Qty', 'New Qty', 'Change'].map((h) => (
            <th key={h} style={{ background: '#F5FBFF', color: '#0077B6', fontWeight: 600, fontSize: 12, padding: '8px 14px', borderBottom: '1.5px solid #CAF0F8', textAlign: 'left' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const ProductDiffTable = ({ diff }) => (
  <div style={{ background: '#FFFFFF', border: '1.5px solid #90E0EF', borderRadius: 12, overflow: 'hidden' }}>
    <div style={{ padding: '10px 14px', background: '#EAF6FB', borderBottom: '1.5px solid #CAF0F8' }}>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#03045E' }}>📦 Product Field Changes</p>
    </div>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr>
          {['Field', 'Current Value', 'Proposed Value'].map((h) => (
            <th key={h} style={{ background: '#F5FBFF', color: '#0077B6', fontWeight: 600, fontSize: 12, padding: '8px 14px', borderBottom: '1.5px solid #CAF0F8', textAlign: 'left' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {diff.length === 0 ? (
          <tr><td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: '#90E0EF', fontSize: 13 }}>No changes proposed.</td></tr>
        ) : (
          diff.map(({ field, oldValue, newValue }) => {
            const changed = JSON.stringify(oldValue) !== JSON.stringify(newValue);
            const rowStyle = changed ? ROW_STYLES[DIFF_COLORS.ADDED] : ROW_STYLES[DIFF_COLORS.UNCHANGED];
            return (
              <tr key={field}>
                <td style={{ ...rowStyle, padding: '9px 14px', fontWeight: 500, textTransform: 'capitalize', borderBottom: '1px solid #CAF0F8' }}>{field}</td>
                <td style={{ ...rowStyle, padding: '9px 14px', color: '#6B7280', borderBottom: '1px solid #CAF0F8' }}>{fmt(oldValue)}</td>
                <td style={{ ...rowStyle, padding: '9px 14px', fontWeight: 600, borderBottom: '1px solid #CAF0F8' }}>{fmt(newValue)}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

/**
 * ECODiff — renders colored diff table for Product or BOM ECOs.
 */
const ECODiff = ({ ecoType, currentRecord, proposedChanges }) => {
  if (!currentRecord || !proposedChanges) {
    return <p style={{ fontSize: 13, color: '#90E0EF' }}>No diff available.</p>;
  }

  if (ecoType === ECO_TYPES.PRODUCT) {
    const diff = computeProductDiff(currentRecord, proposedChanges);
    return <ProductDiffTable diff={diff} />;
  }

  if (ecoType === ECO_TYPES.BOM) {
    const { components } = computeBOMDiff(currentRecord, proposedChanges);
    return (
      <DiffTable headers="🔧 Component Changes">
        {components.length === 0 ? (
          <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#90E0EF' }}>No component changes.</td></tr>
        ) : (
          components.map((c) => {
            const s = ROW_STYLES[c.changeType] || ROW_STYLES[DIFF_COLORS.UNCHANGED];
            return (
              <tr key={c.componentId}>
                <td style={{ ...s, padding: '9px 14px', fontWeight: 500, borderBottom: '1px solid #CAF0F8', borderRadius: '0 0 0 0', marginBottom: 4 }}>{c.componentName}</td>
                <td style={{ ...s, padding: '9px 14px', borderBottom: '1px solid #CAF0F8' }}>{c.oldQty ?? <span style={{ color: '#90E0EF' }}>—</span>}</td>
                <td style={{ ...s, padding: '9px 14px', fontWeight: 600, borderBottom: '1px solid #CAF0F8' }}>
                  {c.newQty ?? <span style={{ color: '#A32D2D', fontWeight: 600 }}>Removed</span>}
                </td>
                <td style={{ ...s, padding: '9px 14px', fontSize: 11, fontWeight: 600, borderBottom: '1px solid #CAF0F8' }}>
                  {CHANGE_LABEL[c.changeType]}
                </td>
              </tr>
            );
          })
        )}
      </DiffTable>
    );
  }

  return null;
};

const fmt = (val) => {
  if (val == null) return '—';
  if (Array.isArray(val)) return val.join(', ') || '—';
  if (typeof val === 'number') return val.toLocaleString();
  return String(val);
};

export default ECODiff;
