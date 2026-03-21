/**
 * Table — white card with RevoraX-styled thead, tbody rows.
 */
const Table = ({ headers = [], children, emptyMessage = 'No records found.' }) => (
  <div style={{
    background: '#FFFFFF',
    border: '1.5px solid #90E0EF',
    borderRadius: 12,
    overflow: 'hidden',
  }}>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                background: '#EAF6FB',
                color: '#0077B6',
                fontSize: 12,
                fontWeight: 600,
                padding: '9px 14px',
                borderBottom: '1.5px solid #90E0EF',
                textAlign: 'left',
                whiteSpace: 'nowrap',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children || (
            <tr>
              <td colSpan={headers.length} style={{
                padding: '40px 14px', textAlign: 'center',
                color: '#90E0EF', fontSize: 13,
              }}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

Table.Row = ({ children, onClick, className = '' }) => (
  <tr
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : undefined }}
    onMouseEnter={(e) => { if (onClick || true) Array.from(e.currentTarget.cells).forEach(c => c.style.background = '#F5FBFF'); }}
    onMouseLeave={(e) => { Array.from(e.currentTarget.cells).forEach(c => c.style.background = ''); }}
  >
    {children}
  </tr>
);

Table.Cell = ({ children, className = '' }) => (
  <td style={{
    padding: '9px 14px',
    borderBottom: '1px solid #CAF0F8',
    color: '#03045E',
    fontSize: 13,
    transition: 'background 0.15s',
  }}>
    {children}
  </td>
);

export default Table;
