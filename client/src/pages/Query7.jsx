import React, { useEffect, useState } from 'react';
import { fetchQueryWithParam } from '../services/api';
import Table from '../components/Table';

function Query1() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchQueryWithParam(7,'cuit=30660608175')
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
    { Header: 'Fecha', accessor: 'fecha' },
    { Header: 'ID pedido', accessor: 'id_pedido' },
    { Header: 'Total con IVA', accessor: 'total_con_iva' },
    { Header: 'Total sin IVA', accessor: 'total_sin_iva' }
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>Listar los datos de todas las órdenes que hayan sido pedidas al proveedor cuyo CUIT es 30-66060817-5.</h2>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default Query1;
