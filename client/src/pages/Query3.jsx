import React, { useEffect, useState } from 'react';
import { fetchQuery } from '../services/api';
import Table from '../components/Table';

function Query1() {
  const [data, setData] = useState([]);

  useEffect(() => {
  fetchQuery(3)
    .then(res => {
      if (res.data && Array.isArray(res.data.data)) {
        console.log("Datos recibidos:", res.data.data);
        const dataWithTelStr = res.data.data.map(item => ({
          id_proveedor: item.id_proveedor,
          razon_social: item.razon_social,
          telefono: `(${item.telefono.codigo_area}) ${item.telefono.nro_telefono}`
        }));

        setData(dataWithTelStr);
      } else {
        setData([]);
      }
    })
    .catch(error => {
      console.error("Error en fetchQuery:", error);
      setData([]);
    });
}, []);

const columns = [
  { Header: 'ID', accessor: 'id_proveedor' },
  { Header: 'Razón Social', accessor: 'razon_social' },
  { Header: 'Teléfono', accessor: 'telefono' }
];

  return (
    <div style={{ padding: 16 }}>
      <h2>Mostrar cada teléfono junto con los datos del proveedor.</h2>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default Query1;
