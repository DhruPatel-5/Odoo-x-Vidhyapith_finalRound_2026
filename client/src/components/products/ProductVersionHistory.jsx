import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductHistory } from '../../api/products';
import { StatusBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatDate';

/**
 * ProductVersionHistory — timeline of all versions for a product.
 */
const ProductVersionHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductHistory(id)
      .then((res) => setHistory(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="h-40 flex items-center justify-center text-gray-400">Loading history…</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
        <h2 className="text-lg font-semibold text-gray-900">Version History</h2>
        <span className="text-sm text-gray-400">{history.length} version{history.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-4">
          {history.map((version, i) => (
            <div key={version._id} className="flex gap-4 pl-4 relative">
              {/* Dot */}
              <div className={`absolute left-0 top-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                version.status === 'Active'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-400 border-gray-300'
              }`}>
                {version.version}
              </div>

              <div className="ml-8 flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{version.name}</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{version.version}</span>
                    <StatusBadge status={version.status} />
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(version.createdAt)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <span>Sale: <strong>${version.salePrice?.toLocaleString()}</strong></span>
                  <span>Cost: <strong>${version.costPrice?.toLocaleString()}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductVersionHistory;
