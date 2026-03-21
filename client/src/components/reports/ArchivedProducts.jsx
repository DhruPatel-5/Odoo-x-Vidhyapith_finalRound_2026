import { useEffect, useState } from 'react';
import { getArchived } from '../../api/reports';
import Table from '../common/Table';
import { StatusBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatDate';

/** ArchivedProducts — lists all archived products and BOMs. */
const ArchivedProducts = () => {
  const [data, setData] = useState({ products: [], boms: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArchived().then((r) => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-40 flex items-center justify-center text-gray-400">Loading…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">Archived Products ({data.products.length})</h3>
        <Table headers={['Name', 'Version', 'Sale Price', 'Cost Price', 'Archived On']}>
          {data.products.map((p) => (
            <Table.Row key={p._id}>
              <Table.Cell><span className="font-medium text-gray-700">{p.name}</span></Table.Cell>
              <Table.Cell><span className="font-mono text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded">{p.version}</span></Table.Cell>
              <Table.Cell>${p.salePrice?.toLocaleString()}</Table.Cell>
              <Table.Cell>${p.costPrice?.toLocaleString()}</Table.Cell>
              <Table.Cell className="text-xs text-gray-400">{formatDate(p.updatedAt)}</Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">Archived BOMs ({data.boms.length})</h3>
        <Table headers={['Product', 'BOM Version', 'Components', 'Archived On']}>
          {data.boms.map((b) => (
            <Table.Row key={b._id}>
              <Table.Cell>{b.product?.name || '—'}</Table.Cell>
              <Table.Cell><span className="font-mono text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded">{b.version}</span></Table.Cell>
              <Table.Cell>{b.components?.length ?? 0}</Table.Cell>
              <Table.Cell className="text-xs text-gray-400">{formatDate(b.updatedAt)}</Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </div>
    </div>
  );
};

export default ArchivedProducts;
