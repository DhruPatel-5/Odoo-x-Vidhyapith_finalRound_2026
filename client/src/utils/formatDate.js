/**
 * Date formatting utilities.
 */

/**
 * Format an ISO date string or Date object to a human-readable local date.
 * @param {string|Date} dateStr
 * @returns {string} e.g. "21 Mar 2026"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format as date + time.
 * @param {string|Date} dateStr
 * @returns {string} e.g. "21 Mar 2026, 14:22"
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format as relative time from now.
 * @param {string|Date} dateStr
 * @returns {string} e.g. "3 days ago"
 */
export const formatRelative = (dateStr) => {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
