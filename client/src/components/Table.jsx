import React from 'react';

function Table({ columns, data }) {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.accessor} style={{ textAlign: 'left' }}>
              {col.Header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {safeData.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: 'center' }}>
              No hay datos para mostrar
            </td>
          </tr>
        ) : (
          safeData.map((row, idx) => (
            <tr key={idx}>
              {columns.map(col => (
                <td key={col.accessor}>{row[col.accessor]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default Table;
