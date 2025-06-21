import React, { useEffect, useState } from 'react';
import { fetchQuery } from '../services/api';
import Table from '../components/Table';

function Query1() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchQuery(10)
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
    { Header: 'Fecha', accessor: 'fechaDate' },
    { Header: 'ID pedido', accessor: 'id_pedido' },
    { Header: 'Razón Social', accessor: 'razon_social' },
    { Header: 'Total sin IVA', accessor: 'total_sin_iva' },
    { Header: 'Total con IVA', accessor: 'total_con_iva' }
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>órdenes de pedido ordenadas por fecha (incluyendo la razón social del proveedor y el total de la orden sin y con IVA).</h2>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default Query1;
