import { useState, useEffect } from 'react';
import { getStages, createStage, updateStage, deleteStage } from '../../api/settings';
import Button from '../common/Button';
import Modal from '../common/Modal';

/**
 * StageManager — admin UI for ECO stage CRUD.
 * Displays stages in order with add/edit/delete controls.
 */
const StageManager = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', order: 1, requiresApproval: false, isFinal: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getStages().then((r) => setStages(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ name: '', order: (stages.length + 1), requiresApproval: false, isFinal: false });
    setEditing(null);
    setModal('add');
  };

  const openEdit = (stage) => {
    setForm({ name: stage.name, order: stage.order, requiresApproval: stage.requiresApproval, isFinal: stage.isFinal });
    setEditing(stage);
    setModal('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (modal === 'add') {
        await createStage(form);
      } else {
        await updateStage(editing._id, form);
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stage?')) return;
    await deleteStage(id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">ECO Stages</h3>
        <Button size="sm" onClick={openAdd}>+ Add Stage</Button>
      </div>

      {loading ? (
        <div className="h-20 flex items-center justify-center text-gray-400">Loading…</div>
      ) : (
        <div className="space-y-2">
          {stages.map((stage) => (
            <div key={stage._id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                {stage.order}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{stage.name}</p>
                <div className="flex gap-3 mt-0.5">
                  {stage.requiresApproval && <span className="text-xs text-amber-600 font-medium">Requires Approval</span>}
                  {stage.isFinal && <span className="text-xs text-emerald-600 font-medium">Final Stage</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => openEdit(stage)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(stage._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Stage' : 'Edit Stage'}>
        <form onSubmit={handleSave} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stage Name *</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. QA Review"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order *</label>
            <input type="number" min="1" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.requiresApproval}
                onChange={(e) => setForm((p) => ({ ...p, requiresApproval: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded" />
              <span className="text-sm text-gray-700">Requires Approval</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFinal}
                onChange={(e) => setForm((p) => ({ ...p, isFinal: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded" />
              <span className="text-sm text-gray-700">Final Stage (triggers ECO apply)</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving}>Save Stage</Button>
            <Button type="button" variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StageManager;
