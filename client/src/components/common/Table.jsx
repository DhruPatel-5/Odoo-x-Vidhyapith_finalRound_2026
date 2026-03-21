/**
 * Table wrapper with white card, rounded corners, and striped rows.
 * @param {string[]} headers - Column header labels
 * @param {React.ReactNode[]} rows - Row elements (use <Table.Row>)
 * @param {string} emptyMessage - Shown when rows is empty
 */
const Table = ({ headers = [], children, emptyMessage = 'No records found.' }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {children ? (
              children
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-4 py-10 text-center text-gray-400 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/** Table row with optional striped background. */
Table.Row = ({ children, className = '', onClick }) => (
  <tr
    onClick={onClick}
    className={`hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </tr>
);

/** Table data cell. */
Table.Cell = ({ children, className = '' }) => (
  <td className={`px-4 py-3 text-gray-700 whitespace-nowrap ${className}`}>{children}</td>
);

export default Table;
