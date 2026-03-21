import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Table from '../common/Table';
import { StatusBadge, Badge } from '../common/Badge';
import Button from '../common/Button';
import { useECO } from '../../hooks/useECO';
import { useAuth } from '../../context/AuthContext';
import { canCreate } from '../../utils/roleGuard';
import { MODULES } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

/**
 * ECOList — table of all Engineering Change Orders.
 */
const ECOList = () => {
  const { ecos, loading, error, fetchECOs } = useECO();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const role = currentUser?.role;

  useEffect(() => { fetchECOs(); }, [fetchECOs]);

  const ecoTypColor = { Product: 'blue', BoM: 'purple' };

  if (loading) return <div className="h-40 flex items-center justify-center text-gray-400">Loading ECOs…</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Engineering Change Orders</h2>
          <p className="text-sm text-gray-500">{ecos.length} total</p>
        </div>
        {canCreate(role, MODULES.ECO) && (
          <Button onClick={() => navigate('/eco/new')}>+ New ECO</Button>
        )}
      </div>

      <Table headers={['Title', 'Type', 'Product', 'Stage', 'Status', 'Created By', 'Date', 'Actions']}>
        {ecos.map((e) => (
          <Table.Row key={e._id} onClick={() => navigate(`/eco/${e._id}`)}>
            <Table.Cell>
              <span className="font-medium text-gray-900">{e.title}</span>
            </Table.Cell>
            <Table.Cell>
              <Badge color={ecoTypColor[e.ecoType] || 'gray'}>{e.ecoType}</Badge>
            </Table.Cell>
            <Table.Cell className="text-gray-600">{e.product?.name || '—'}</Table.Cell>
            <Table.Cell>
              <span className="font-medium text-indigo-700">{e.stage}</span>
            </Table.Cell>
            <Table.Cell><StatusBadge status={e.status} /></Table.Cell>
            <Table.Cell className="text-gray-500 text-xs">{e.user?.name || '—'}</Table.Cell>
            <Table.Cell className="text-gray-400 text-xs">{formatDate(e.createdAt)}</Table.Cell>
            <Table.Cell>
              <div onClick={(e) => e.stopPropagation()}>
                <Link to={`/eco/${e._id}`}>
                  <Button size="sm" variant="secondary">View</Button>
                </Link>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
};

export default ECOList;
