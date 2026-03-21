import { DIFF_COLORS } from '../../utils/constants';

/**
 * DiffRow — colored table row for BOM/Product diffs.
 * @param {'green'|'red'|'neutral'} changeType
 */
const DiffRow = ({ changeType, children }) => {
  const colorMap = {
    [DIFF_COLORS.ADDED]:     'bg-green-50 text-green-900',
    [DIFF_COLORS.REDUCED]:   'bg-red-50 text-red-900',
    [DIFF_COLORS.UNCHANGED]: 'bg-white text-gray-700',
  };
  const cls = colorMap[changeType] || colorMap[DIFF_COLORS.UNCHANGED];
  return <tr className={`${cls} border-b border-gray-100 last:border-0`}>{children}</tr>;
};

DiffRow.Cell = ({ children, className = '' }) => (
  <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>
);

export default DiffRow;
