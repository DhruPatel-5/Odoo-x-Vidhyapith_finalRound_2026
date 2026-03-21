import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useECO } from '../../hooks/useECO';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, Badge } from '../common/Badge';
import Button from '../common/Button';
import ECODiff from './ECODiff';
import { formatDate } from '../../utils/formatDate';
import { canApproveECO } from '../../utils/roleGuard';
import { ECO_TYPES } from '../../utils/constants';

const ECODetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { fetchECOById, approveECO } = useECO();

  const [eco, setEco] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const role = currentUser?.role;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const ecoData = await fetchECOById(id);
        setEco(ecoData);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const isApproved = eco?.status === 'Applied';
  const canApprove = !isApproved && canApproveECO(role);

  const handleApprove = async () => {
    if (!window.confirm(`Approve "${eco.title}"? This will apply the change.`)) return;
    setActionError('');
    setActionLoading(true);
    try {
      const result = await approveECO(id);
      const updated = result?.eco || result;
      if (updated?._id) setEco(updated);
      const fresh = await fetchECOById(id);
      if (fresh) setEco(fresh);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#90E0EF', fontSize: 13 }}>Loading…</div>;
  if (!eco) return <div style={{ color: '#A32D2D', padding: 16, fontSize: 13 }}>ECO not found</div>;

  const currentRecord = eco.ecoType === ECO_TYPES.BOM ? eco.bom : eco.product;

  return (
    <div className="page-content" style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#90E0EF' }}>←</button>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#03045E', flex: 1 }}>{eco.title}</h2>
        <StatusBadge status={eco.status} />
        <Badge color={eco.ecoType === ECO_TYPES.BOM ? 'blue' : 'teal'}>{eco.ecoType}</Badge>
      </div>

      {/* Approve button — approver and admin only */}
      {canApprove && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button onClick={handleApprove} loading={actionLoading} variant="success">
            ✓ Approve ECO
          </Button>
          {actionError && <p style={{ fontSize: 12, color: '#A32D2D', margin: 0 }}>{actionError}</p>}
        </div>
      )}

      {/* Applied badge for already-approved ECOs */}
      {isApproved && (
        <div style={{ background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 8, padding: '10px 16px', fontSize: 12, color: '#166534', fontWeight: 600 }}>
          ✅ This ECO has been approved and applied.
        </div>
      )}

      {/* ECO Info Card */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid #90E0EF', borderRadius: 12, padding: 20 }}>
        <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600, color: '#03045E' }}>ECO Details</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
          <Field label="Product">{eco.product?.name} <span style={{ fontFamily: 'monospace', fontSize: 11, background: '#EAF6FB', padding: '1px 6px', borderRadius: 4 }}>{eco.product?.version}</span></Field>
          {eco.ecoType === ECO_TYPES.BOM && <Field label="BOM Version"><span style={{ fontFamily: 'monospace' }}>{eco.bom?.version || '—'}</span></Field>}
          <Field label="Stage"><span style={{ color: '#0077B6', fontWeight: 600 }}>{eco.stage}</span></Field>
          <Field label="Status"><StatusBadge status={eco.status} /></Field>
          <Field label="Version Update">{eco.versionUpdate ? '✅ New version' : '⚠️ Patch in-place'}</Field>
          <Field label="Effective Date">{formatDate(eco.effectiveDate)}</Field>
          <Field label="Created By">{eco.user?.name || '—'}</Field>
          <Field label="Created">{formatDate(eco.createdAt)}</Field>
        </div>
      </div>

      {/* Proposed Changes Diff — always read-only for all roles here */}
      <div>
        <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: '#03045E' }}>Proposed Changes</p>
        <ECODiff ecoType={eco.ecoType} currentRecord={currentRecord} proposedChanges={eco.proposedChanges} />
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <p style={{ margin: '0 0 3px', fontSize: 11, fontWeight: 500, color: '#90E0EF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
    <div style={{ fontSize: 13, color: '#03045E' }}>{children}</div>
  </div>
);

export default ECODetail;
