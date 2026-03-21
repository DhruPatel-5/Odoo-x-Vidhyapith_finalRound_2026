import { useState, useEffect } from 'react';
import { getRules, createRule, deleteRule, getStages } from '../../api/settings';
import { ROLES } from '../../utils/constants';
import Button from '../common/Button';
import Table from '../common/Table';
import { Badge } from '../common/Badge';

/**
 * ApprovalRuleManager — admin UI to map stages → approver roles.
 */
const ApprovalRuleManager = () => {
  const [rules, setRules] = useState([]);
  const [stages, setStages] = useState([]);
  const [form, setForm] = useState({ stage: '', approverRole: ROLES.APPROVER });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [rulesRes, stagesRes] = await Promise.all([getRules(), getStages()]);
    setRules(rulesRes.data);
    setStages(stagesRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.stage || !form.approverRole) return;
    setSaving(true);
    try {
      await createRule(form);
      await load();
      setForm({ stage: form.stage, approverRole: ROLES.APPROVER });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this rule?')) return;
    await deleteRule(id);
    await load();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-900">Approval Rules</h3>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">Add Rule</p>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Stage</label>
            <select value={form.stage} onChange={(e) => setForm((p) => ({ ...p, stage: e.target.value }))} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              <option value="">Select stage…</option>
              {stages.filter((s) => s.requiresApproval).map((s) => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Approver Role</label>
            <select value={form.approverRole} onChange={(e) => setForm((p) => ({ ...p, approverRole: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              {Object.values(ROLES).filter((r) => r !== ROLES.OPERATIONS).map((r) => (
                <option key={r} value={r} className="capitalize">{r}</option>
              ))}
            </select>
          </div>
          <Button type="submit" loading={saving}>Add Rule</Button>
        </div>
      </form>

      {/* Rules table */}
      {loading ? (
        <div className="h-20 flex items-center justify-center text-gray-400">Loading…</div>
      ) : (
        <Table headers={['Stage', 'Approver Role', 'Actions']}>
          {rules.length === 0 ? (
            <Table.Row><Table.Cell className="text-center text-gray-400">No rules configured.</Table.Cell></Table.Row>
          ) : (
            rules.map((rule) => (
              <Table.Row key={rule._id}>
                <Table.Cell className="font-medium">{rule.stage}</Table.Cell>
                <Table.Cell><Badge color="amber" className="capitalize">{rule.approverRole}</Badge></Table.Cell>
                <Table.Cell>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(rule._id)}>Delete</Button>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table>
      )}
    </div>
  );
};

export default ApprovalRuleManager;
