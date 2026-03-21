import { useEffect, useState } from 'react';
import { getAuditLog } from '../../api/reports';
import Table from '../common/Table';
import { Badge } from '../common/Badge';
import { formatDateTime } from '../../utils/formatDate';

const ACTION_COLORS = {
  ECO_CREATED:     'indigo',
  STAGE_TRANSITION:'amber',
  ECO_APPROVED:    'green',
  ECO_APPLIED:     'purple',
  VERSION_CREATED: 'blue',
  RECORD_ARCHIVED: 'red',
  PRODUCT_UPDATED: 'gray',
  BOM_UPDATED:     'gray',
};

/** AuditLog — filterable audit trail. */
const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ model: '', action: '' });

  const loadLogs = () => {
    setLoading(true);
    const params = {};
    if (filter.model) params.model = filter.model;
    if (filter.action) params.action = filter.action;
    getAuditLog(params).then((r) => setLogs(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadLogs(); }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Audit Log</h3>

      {/* Filters */}
      <div className="flex gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Model</label>
          <select value={filter.model} onChange={(e) => setFilter((p) => ({ ...p, model: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="">All Models</option>
            <option>ECO</option><option>Product</option><option>BOM</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Action</label>
          <select value={filter.action} onChange={(e) => setFilter((p) => ({ ...p, action: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="">All Actions</option>
            {['ECO_CREATED','STAGE_TRANSITION','ECO_APPROVED','ECO_APPLIED','VERSION_CREATED','RECORD_ARCHIVED','PRODUCT_UPDATED','BOM_UPDATED'].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <button onClick={loadLogs} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
          Apply
        </button>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-gray-400">Loading…</div>
      ) : (
        <Table headers={['Action', 'Model', 'Performed By', 'Timestamp']}>
          {logs.map((log) => (
            <Table.Row key={log._id}>
              <Table.Cell>
                <Badge color={ACTION_COLORS[log.action] || 'gray'}>{log.action}</Badge>
              </Table.Cell>
              <Table.Cell className="text-gray-600">{log.affectedModel}</Table.Cell>
              <Table.Cell>
                <div>
                  <p className="text-sm font-medium">{log.performedBy?.name || '—'}</p>
                  <p className="text-xs text-gray-400 capitalize">{log.performedBy?.role}</p>
                </div>
              </Table.Cell>
              <Table.Cell className="text-xs text-gray-400">{formatDateTime(log.timestamp)}</Table.Cell>
            </Table.Row>
          ))}
        </Table>
      )}
    </div>
  );
};

export default AuditLog;
