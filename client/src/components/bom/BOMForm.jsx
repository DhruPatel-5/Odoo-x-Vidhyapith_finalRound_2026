import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../common/Button';
import { useBOM } from '../../hooks/useBOM';
import { useProducts } from '../../hooks/useProducts';

/**
 * BOMForm — create or edit a Bill of Materials.
 * Components are selected from product dropdown with quantity input.
 */
const BOMForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBOMById, createBOM, updateBOM } = useBOM();
  const { products, fetchProducts } = useProducts();
  const isEdit = Boolean(id);

  const [productId, setProductId] = useState('');
  const [components, setComponents] = useState([{ product: '', quantity: 1 }]);
  const [operations, setOperations] = useState([{ name: '', duration: 0, workCenter: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    if (isEdit) {
      fetchBOMById(id).then((bom) => {
        if (bom) {
          setProductId(bom.product?._id || bom.product || '');
          setComponents(bom.components.length ? bom.components.map((c) => ({
            product: c.product?._id || c.product,
            quantity: c.quantity,
          })) : [{ product: '', quantity: 1 }]);
          setOperations(bom.operations.length ? bom.operations : [{ name: '', duration: 0, workCenter: '' }]);
        }
      });
    }
  }, [id]);

  const addComponent = () => setComponents((prev) => [...prev, { product: '', quantity: 1 }]);
  const removeComponent = (i) => setComponents((prev) => prev.filter((_, idx) => idx !== i));
  const updateComponent = (i, key, val) => setComponents((prev) => {
    const next = [...prev]; next[i] = { ...next[i], [key]: val }; return next;
  });

  const addOperation = () => setOperations((prev) => [...prev, { name: '', duration: 0, workCenter: '' }]);
  const removeOperation = (i) => setOperations((prev) => prev.filter((_, idx) => idx !== i));
  const updateOperation = (i, key, val) => setOperations((prev) => {
    const next = [...prev]; next[i] = { ...next[i], [key]: val }; return next;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const validComponents = components.filter((c) => c.product);
      const validOperations = operations.filter((o) => o.name.trim());
      const data = { product: productId, components: validComponents, operations: validOperations };
      if (isEdit) {
        await updateBOM(id, { components: validComponents, operations: validOperations });
      } else {
        await createBOM(data);
      }
      navigate('/bom');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const activeProducts = products.filter((p) => p.status === 'Active');

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
        <h2 className="text-lg font-semibold text-gray-900">{isEdit ? 'Edit BOM' : 'New Bill of Materials'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        {/* Product */}
        {!isEdit && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent Product *</label>
            <select
              value={productId} onChange={(e) => setProductId(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Select product…</option>
              {activeProducts.map((p) => (
                <option key={p._id} value={p._id}>{p.name} ({p.version})</option>
              ))}
            </select>
          </div>
        )}

        {/* Components */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Components</h3>
            <Button type="button" size="sm" variant="secondary" onClick={addComponent}>+ Add</Button>
          </div>
          <div className="space-y-3">
            {components.map((comp, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select
                  value={comp.product}
                  onChange={(e) => updateComponent(i, 'product', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Select component…</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>{p.name} ({p.version})</option>
                  ))}
                </select>
                <input
                  type="number" min="0" step="1"
                  value={comp.quantity}
                  onChange={(e) => updateComponent(i, 'quantity', Number(e.target.value))}
                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Qty"
                />
                <button type="button" onClick={() => removeComponent(i)}
                  className="text-red-400 hover:text-red-600 px-2 text-lg">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Operations */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Operations</h3>
            <Button type="button" size="sm" variant="secondary" onClick={addOperation}>+ Add</Button>
          </div>
          <div className="space-y-3">
            {operations.map((op, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={op.name} onChange={(e) => updateOperation(i, 'name', e.target.value)}
                  placeholder="Operation name"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <input
                  type="number" min="0" value={op.duration}
                  onChange={(e) => updateOperation(i, 'duration', Number(e.target.value))}
                  placeholder="Mins"
                  className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <input
                  value={op.workCenter} onChange={(e) => updateOperation(i, 'workCenter', e.target.value)}
                  placeholder="Work center"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button type="button" onClick={() => removeOperation(i)}
                  className="text-red-400 hover:text-red-600 px-2 text-lg">×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>{isEdit ? 'Save Changes' : 'Create BOM'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default BOMForm;
