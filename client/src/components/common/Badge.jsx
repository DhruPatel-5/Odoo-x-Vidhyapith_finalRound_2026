/**
 * StatusBadge — color-coded pill for Active/Archived/Open/Applied/stage names.
 * @param {string} status
 */
const STATUS_MAP = {
  Active:   'bg-green-100 text-green-800',
  Archived: 'bg-red-100 text-red-800',
  Open:     'bg-amber-100 text-amber-800',
  Applied:  'bg-indigo-100 text-indigo-800',
  New:      'bg-gray-100 text-gray-700',
  Approval: 'bg-orange-100 text-orange-700',
  Done:     'bg-emerald-100 text-emerald-800',
};

export const StatusBadge = ({ status }) => {
  const cls = STATUS_MAP[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
};

/**
 * Generic Badge.
 * @param {'indigo'|'green'|'red'|'amber'|'gray'|'blue'|'purple'} color
 */
export const Badge = ({ children, color = 'gray' }) => {
  const colorMap = {
    indigo: 'bg-indigo-100 text-indigo-700',
    green:  'bg-green-100 text-green-700',
    red:    'bg-red-100 text-red-700',
    amber:  'bg-amber-100 text-amber-700',
    gray:   'bg-gray-100 text-gray-700',
    blue:   'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[color]}`}>
      {children}
    </span>
  );
};

export default StatusBadge;
