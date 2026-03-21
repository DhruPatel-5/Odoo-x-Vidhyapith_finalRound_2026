import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../common/Button';
import { useProducts } from '../../hooks/useProducts';

/**
 * ProductForm — used for both Create and Edit.
 * If `id` param exists, loads product and pre-fills the form.
 */
const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductById, createProduct, updateProduct, loading } = useProducts();

  const [form, setForm] = useState({
    name: '',
    salePrice: '',
    costPrice: '',
    attachments: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      fetchProductById(id).then((p) => {
        if (p) {
          setForm({
            name: p.name || '',
            salePrice: p.salePrice ?? '',
            costPrice: p.costPrice ?? '',
            attachments: (p.attachments || []).join(', '),
          });
        }
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        salePrice: parseFloat(form.salePrice),
        costPrice: parseFloat(form.costPrice),
        attachments: form.attachments ? form.attachments.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      if (isEdit) {
        await updateProduct(id, data);
      } else {
        await createProduct(data);
      }
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
        <h2 className="text-lg font-semibold text-gray-900">{isEdit ? 'Edit Product' : 'New Product'}</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              name="name" value={form.name} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. iPhone 17"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price *</label>
              <input
                type="number" name="salePrice" value={form.salePrice} onChange={handleChange}
                required min="0" step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="999.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price *</label>
              <input
                type="number" name="costPrice" value={form.costPrice} onChange={handleChange}
                required min="0" step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="500.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
            <input
              name="attachments" value={form.attachments} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="file1.pdf, spec.docx (comma-separated)"
            />
            <p className="text-xs text-gray-400 mt-1">Comma-separated list of file names or URLs</p>
          </div>

          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Version</label>
              <p className="text-sm text-gray-400">Auto-managed by ECO. Cannot be changed manually.</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving}>{isEdit ? 'Save Changes' : 'Create Product'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
