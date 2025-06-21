import React, { useEffect, useState } from 'react';
import { fetchQuery } from '../services/api';
import Table from '../components/Table';

function Query1() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchQuery(6)
      .then(res => {
        console.log("Respuesta API completa:", res.data);
        if (res.data && Array.isArray(res.data.data)) {
          const dataWithTelStr = res.data.data.map(item => ({
            ...item,
            telefonos: Array.isArray(item.telefonos)
              ? item.telefonos
                  .map(tel => `(${tel.codigo_area}) ${tel.nro_telefono}`)
                  .join(', ')
              : ''
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
    { Header: 'Total sin iva', accessor: 'total_sin_iva' },
    { Header: 'Total con iva', accessor: 'total_con_iva' },
    { Header: 'Razón Social', accessor: 'razon_social'},
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>Devolver todos los proveedores, con la cantidad de ordenes que tienen registradas y el monto total pedido, con y sin IVA incluido (si no tienen órdenes registradas considerar cantidad y monto en 0).</h2>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default Query1;
