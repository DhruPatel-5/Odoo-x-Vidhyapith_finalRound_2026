import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { StatusBadge } from '../common/Badge';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatDate';

/**
 * ProductDetail — shows a product's full info and link to version history.
 */
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProduct: product, loading, fetchProductById } = useProducts();

  useEffect(() => { fetchProductById(id); }, [id]);

  if (loading) return <div className="h-40 flex items-center justify-center text-gray-400">Loading…</div>;
  if (!product) return <div className="text-red-500 p-4">Product not found</div>;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Back */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
        <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
        <StatusBadge status={product.status} />
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Version">
            <span className="font-mono text-indigo-600 font-semibold">{product.version}</span>
          </Field>
          <Field label="Status"><StatusBadge status={product.status} /></Field>
          <Field label="Sale Price">${product.salePrice?.toLocaleString()}</Field>
          <Field label="Cost Price">${product.costPrice?.toLocaleString()}</Field>
          <Field label="Created By">{product.createdBy?.name || '—'}</Field>
          <Field label="Created At">{formatDate(product.createdAt)}</Field>
        </div>

        {product.attachments?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Attachments</p>
            <div className="flex flex-wrap gap-2">
              {product.attachments.map((a, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">📎 {a}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to={`/products/${id}/history`}>
          <Button variant="secondary">📜 Version History</Button>
        </Link>
        <Link to={`/products/${id}/edit`}>
          <Button variant="secondary">✏️ Edit</Button>
        </Link>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
    <p className="text-sm text-gray-900">{children}</p>
  </div>
);

export default ProductDetail;
