import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Table from '../common/Table';
import { StatusBadge } from '../common/Badge';
import Button from '../common/Button';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../context/AuthContext';
import { canCreate, canArchive } from '../../utils/roleGuard';
import { MODULES } from '../../utils/constants';

/**
 * ProductList — displays all products in a table with actions.
 */
const ProductList = () => {
  const { products, loading, error, fetchProducts, archiveProduct } = useProducts();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const role = currentUser?.role;

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleArchive = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Archive this product?')) return;
    await archiveProduct(id);
  };

  if (loading) return <div className="flex items-center justify-center h-40 text-gray-400">Loading products…</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">{products.length} total</p>
        </div>
        {canCreate(role, MODULES.PRODUCTS) && (
          <Button onClick={() => navigate('/products/new')}>+ New Product</Button>
        )}
      </div>

      <Table headers={['Name', 'Version', 'Sale Price', 'Cost Price', 'Status', 'Created By', 'Actions']}>
        {products.length === 0 ? (
          <Table.Row>
            <Table.Cell className="text-center text-gray-400 col-span-7">No products yet</Table.Cell>
          </Table.Row>
        ) : (
          products.map((p) => (
            <Table.Row key={p._id} onClick={() => navigate(`/products/${p._id}`)}>
              <Table.Cell>
                <span className="font-medium text-gray-900">{p.name}</span>
              </Table.Cell>
              <Table.Cell>
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{p.version}</span>
              </Table.Cell>
              <Table.Cell>${p.salePrice?.toLocaleString()}</Table.Cell>
              <Table.Cell>${p.costPrice?.toLocaleString()}</Table.Cell>
              <Table.Cell><StatusBadge status={p.status} /></Table.Cell>
              <Table.Cell className="text-gray-500 text-xs">{p.createdBy?.name || '—'}</Table.Cell>
              <Table.Cell>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  {canCreate(role, MODULES.PRODUCTS) && (
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/products/${p._id}/edit`)}>
                      Edit
                    </Button>
                  )}
                  {canArchive(role) && p.status === 'Active' && (
                    <Button size="sm" variant="danger" onClick={(e) => handleArchive(p._id, e)}>
                      Archive
                    </Button>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table>
    </div>
  );
};

export default ProductList;
