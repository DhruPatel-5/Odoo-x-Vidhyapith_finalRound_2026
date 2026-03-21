import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useECO } from '../../hooks/useECO';
import { useAuth } from '../../context/AuthContext';
import { getStages } from '../../api/settings';
import { StatusBadge, Badge } from '../common/Badge';
import Button from '../common/Button';
import ECOStageBar from './ECOStageBar';
import ECODiff from './ECODiff';
import { formatDate } from '../../utils/formatDate';
import { canValidate, canApprove } from '../../utils/roleGuard';
import { ECO_TYPES, ECO_STATUS } from '../../utils/constants';

/**
 * ECODetail — full ECO view with stage bar, action buttons, and diff view.
 */
const ECODetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { fetchECOById, validateECO, approveECO, applyECO } = useECO();

  const [eco, setEco] = useState(null);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [ecoData, stagesRes] = await Promise.all([fetchECOById(id), getStages()]);
        setEco(ecoData);
        setStages(stagesRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const currentStageObj = stages.find((s) => s.name === eco?.stage);
  const role = currentUser?.role;
  const isApplied = eco?.status === ECO_STATUS.APPLIED;

  const handleAction = async (action) => {
    setActionError('');
    setActionLoading(true);
    try {
      let result;
      if (action === 'validate') result = await validateECO(id);
      else if (action === 'approve') result = await approveECO(id);
      else if (action === 'apply') result = await applyECO(id);
      const updated = result?.eco || result;
      if (updated?._id) setEco(updated);
      // Reload to get populated nested refs
      const fresh = await fetchECOById(id);
      if (fresh) setEco(fresh);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="h-40 flex items-center justify-center text-gray-400">Loading…</div>;
  if (!eco) return <div className="text-red-500 p-4">ECO not found</div>;

  const showValidate = !isApplied && currentStageObj && !currentStageObj.requiresApproval && !currentStageObj.isFinal && canValidate(role);
  const showApprove = !isApplied && currentStageObj?.requiresApproval && canApprove(role);
  const showApply = !isApplied && currentStageObj?.isFinal && role === 'admin';

  // Determine the current record for diff
  const currentRecord = eco.ecoType === ECO_TYPES.BOM ? eco.bom : eco.product;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
        <h2 className="text-lg font-semibold text-gray-900 flex-1">{eco.title}</h2>
        <StatusBadge status={eco.status} />
        <Badge color={eco.ecoType === ECO_TYPES.BOM ? 'purple' : 'blue'}>{eco.ecoType}</Badge>
      </div>

      {/* Stage Bar */}
      <ECOStageBar stages={stages} currentStage={eco.stage} />

      {/* Action buttons */}
      {!isApplied && (
        <div className="flex gap-3 items-center flex-wrap">
          {showValidate && (
            <Button onClick={() => handleAction('validate')} loading={actionLoading} variant="primary">
              ✓ Validate (Move to {stages[stages.findIndex(s=>s.name===eco.stage)+1]?.name || 'Next'})
            </Button>
          )}
          {showApprove && (
            <Button onClick={() => handleAction('approve')} loading={actionLoading} variant="success">
              ✓ Approve ECO
            </Button>
          )}
          {showApply && (
            <Button onClick={() => handleAction('apply')} loading={actionLoading} variant="primary">
              ⚡ Apply ECO
            </Button>
          )}
          {canValidate(role) && !isApplied && (
            <Link to={`/eco/${id}/edit`}>
              <Button variant="secondary" size="sm">✏️ Edit</Button>
            </Link>
          )}
          {actionError && <p className="text-sm text-red-600">{actionError}</p>}
        </div>
      )}

      {/* ECO Info Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">ECO Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field label="Product">{eco.product?.name} <span className="font-mono text-xs bg-gray-100 px-1 rounded">{eco.product?.version}</span></Field>
          {eco.ecoType === ECO_TYPES.BOM && <Field label="BOM Version"><span className="font-mono">{eco.bom?.version || '—'}</span></Field>}
          <Field label="Stage"><span className="text-indigo-700 font-semibold">{eco.stage}</span></Field>
          <Field label="Status"><StatusBadge status={eco.status} /></Field>
          <Field label="Version Update">{eco.versionUpdate ? '✅ New version' : '⚠️ Patch in-place'}</Field>
          <Field label="Effective Date">{formatDate(eco.effectiveDate)}</Field>
          <Field label="Created By">{eco.user?.name || '—'}</Field>
          <Field label="Created">{formatDate(eco.createdAt)}</Field>
        </div>
      </div>

      {/* Diff */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Proposed Changes</h3>
        <ECODiff
          ecoType={eco.ecoType}
          currentRecord={currentRecord}
          proposedChanges={eco.proposedChanges}
        />
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
    <p className="text-gray-900">{children}</p>
  </div>
);

export default ECODetail;
