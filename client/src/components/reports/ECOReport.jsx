import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getECOReport } from '../../api/reports';
import Table from '../common/Table';
import { StatusBadge, Badge } from '../common/Badge';
import Modal from '../common/Modal';
import ECODiff from '../eco/ECODiff';
import { formatDate } from '../../utils/formatDate';
import { ECO_TYPES } from '../../utils/constants';

/** ECOReport — table of all ECOs with clickable Changes modal. */
const ECOReport = () => {
  const [ecos, setEcos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedECO, setSelectedECO] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getECOReport().then((r) => setEcos(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-40 flex items-center justify-center text-gray-400">Loading…</div>;

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900">ECO Summary Report</h3>
        <Table headers={['Title', 'Type', 'Product', 'Stage', 'Status', 'Created By', 'Date', 'Changes']}>
          {ecos.map((e) => (
            <Table.Row key={e._id} onClick={() => navigate(`/eco/${e._id}`)}>
              <Table.Cell><span className="font-medium">{e.title}</span></Table.Cell>
              <Table.Cell><Badge color={e.ecoType === ECO_TYPES.BOM ? 'purple' : 'blue'}>{e.ecoType}</Badge></Table.Cell>
              <Table.Cell>{e.product?.name || '—'}</Table.Cell>
              <Table.Cell className="text-indigo-700 font-medium">{e.stage}</Table.Cell>
              <Table.Cell><StatusBadge status={e.status} /></Table.Cell>
              <Table.Cell className="text-xs text-gray-500">{e.user?.name || '—'}</Table.Cell>
              <Table.Cell className="text-xs text-gray-400">{formatDate(e.createdAt)}</Table.Cell>
              <Table.Cell>
                <button onClick={(ev) => { ev.stopPropagation(); setSelectedECO(e); }}
                  className="text-xs text-indigo-600 hover:underline font-medium">View Diff</button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </div>

      {/* Diff Modal */}
      <Modal isOpen={!!selectedECO} onClose={() => setSelectedECO(null)} title={selectedECO?.title} size="lg">
        {selectedECO && (
          <ECODiff
            ecoType={selectedECO.ecoType}
            currentRecord={selectedECO.ecoType === ECO_TYPES.BOM ? selectedECO.bom : selectedECO.product}
            proposedChanges={selectedECO.proposedChanges}
          />
        )}
      </Modal>
    </>
  );
};

export default ECOReport;
