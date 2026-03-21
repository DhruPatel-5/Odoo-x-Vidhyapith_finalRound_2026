import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../common/Table';
import { StatusBadge } from '../common/Badge';
import Button from '../common/Button';
import { useBOM } from '../../hooks/useBOM';
import { useAuth } from '../../context/AuthContext';
import { canCreate } from '../../utils/roleGuard';
import { MODULES } from '../../utils/constants';

/**
 * BOMList — shows all Bills of Materials in a table.
 */
const BOMList = () => {
  const { boms, loading, error, fetchBOMs } = useBOM();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const role = currentUser?.role;

  useEffect(() => { fetchBOMs(); }, [fetchBOMs]);

  if (loading) return <div className="h-40 flex items-center justify-center text-gray-400">Loading BOMs…</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bills of Materials</h2>
          <p className="text-sm text-gray-500">{boms.length} total</p>
        </div>
        {canCreate(role, MODULES.BOM) && (
          <Button onClick={() => navigate('/bom/new')}>+ New BOM</Button>
        )}
      </div>

      <Table headers={['Product', 'BOM Version', 'Components', 'Operations', 'Status', 'Actions']}>
        {boms.map((b) => (
          <Table.Row key={b._id} onClick={() => navigate(`/bom/${b._id}`)}>
            <Table.Cell>
              <span className="font-medium text-gray-900">{b.product?.name || '—'}</span>
            </Table.Cell>
            <Table.Cell>
              <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{b.version}</span>
            </Table.Cell>
            <Table.Cell>{b.components?.length ?? 0}</Table.Cell>
            <Table.Cell>{b.operations?.length ?? 0}</Table.Cell>
            <Table.Cell><StatusBadge status={b.status} /></Table.Cell>
            <Table.Cell>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button size="sm" variant="secondary" onClick={() => navigate(`/bom/${b._id}`)}>
                  View
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
};

export default BOMList;
