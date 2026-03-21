import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../api/products';
import { getBOMs } from '../api/bom';
import { getECOs } from '../api/eco';
import { StatusBadge, Badge } from '../components/common/Badge';
import { formatDate } from '../utils/formatDate';
import { canCreate, canViewECO } from '../utils/roleGuard';
import { MODULES, ECO_TYPES } from '../utils/constants';

/**
 * Dashboard — summary cards + recent ECOs + quick actions.
 */
const Dashboard = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  const [stats, setStats] = useState({ products: 0, boms: 0, openECOs: 0, pendingApprovals: 0 });
  const [recentECOs, setRecentECOs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, bomRes, ecoRes] = await Promise.all([
          getProducts().catch(() => ({ data: [] })),
          getBOMs().catch(() => ({ data: [] })),
          canViewECO(role) ? getECOs().catch(() => ({ data: [] })) : { data: [] },
        ]);

        const products = prodRes.data;
        const boms = bomRes.data;
        const ecos = ecoRes.data;

        setStats({
          products: products.filter((p) => p.status === 'Active').length,
          boms: boms.filter((b) => b.status === 'Active').length,
          openECOs: ecos.filter((e) => e.status === 'Open').length,
          pendingApprovals: ecos.filter((e) => e.status === 'Open' && e.stage === 'Approval').length,
        });
        setRecentECOs(ecos.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [role]);

  const cards = [
    { label: 'Active Products', value: stats.products, icon: '📦', color: 'bg-blue-50 text-blue-700', to: '/products' },
    { label: 'Active BOMs', value: stats.boms, icon: '🔧', color: 'bg-emerald-50 text-emerald-700', to: '/bom' },
    ...(canViewECO(role)
      ? [
          { label: 'Open ECOs', value: stats.openECOs, icon: '📋', color: 'bg-amber-50 text-amber-700', to: '/eco' },
          { label: 'Pending Approvals', value: stats.pendingApprovals, icon: '⏳', color: 'bg-red-50 text-red-700', to: '/eco' },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Good {getGreeting()}, {currentUser?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening in your PLM system today.</p>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-gray-100 rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link key={card.label} to={card.to}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Recent ECOs */}
      {canViewECO(role) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Recent Change Orders</h3>
            <Link to="/eco" className="text-sm text-indigo-600 hover:underline">View all →</Link>
          </div>
          {recentECOs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
              No ECOs yet.{' '}
              {canCreate(role, MODULES.ECO) && (
                <Link to="/eco/new" className="text-indigo-600 hover:underline">Create one →</Link>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {recentECOs.map((e, i) => (
                <Link key={e._id} to={`/eco/${e._id}`}
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i < recentECOs.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-sm font-bold flex-shrink-0">
                    {e.ecoType === ECO_TYPES.BOM ? '🔧' : '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{e.title}</p>
                    <p className="text-xs text-gray-400">{e.product?.name} · {formatDate(e.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-medium text-indigo-700">{e.stage}</span>
                    <StatusBadge status={e.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {canCreate(role, MODULES.PRODUCTS) && (
            <Link to="/products/new" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-300 transition-all">
              + New Product
            </Link>
          )}
          {canCreate(role, MODULES.BOM) && (
            <Link to="/bom/new" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-300 transition-all">
              + New BOM
            </Link>
          )}
          {canCreate(role, MODULES.ECO) && (
            <Link to="/eco/new" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all">
              + New ECO
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};

export default Dashboard;
