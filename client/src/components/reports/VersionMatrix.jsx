import { useEffect, useState } from 'react';
import { getVersionHistory } from '../../api/reports';
import { StatusBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatDate';

/** VersionMatrix — product version history grouped per product-family. */
const VersionMatrix = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVersionHistory().then((r) => setGroups(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-40 flex items-center justify-center text-gray-400">Loading…</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Product Version Matrix</h3>
      {groups.map((versions, gi) => {
        const latest = versions[versions.length - 1];
        return (
          <div key={gi} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <span className="font-semibold text-gray-900 text-sm">{latest.name}</span>
              <StatusBadge status={latest.status} />
            </div>
            <div className="divide-y divide-gray-50">
              {versions.map((v) => (
                <div key={v._id} className="flex items-center px-5 py-3 gap-4 hover:bg-gray-50">
                  <span className={`font-mono text-sm font-bold ${v.status === 'Active' ? 'text-indigo-700' : 'text-gray-400'}`}>
                    {v.version}
                  </span>
                  <StatusBadge status={v.status} />
                  <span className="text-sm text-gray-600">Sale: ${v.salePrice?.toLocaleString()}</span>
                  <span className="text-sm text-gray-600">Cost: ${v.costPrice?.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 ml-auto">{formatDate(v.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VersionMatrix;
