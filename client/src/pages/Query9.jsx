import React, { useEffect, useState } from 'react';
import { fetchQueryWithParam } from '../services/api';
import Table from '../components/Table';

function Query1() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchQueryWithParam(9, 'marca=COTO')
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
    { Header: 'ID pedido', accessor: 'id_pedido' },
    { Header: 'ID proveedor', accessor: 'id_proveedor' },
    { Header: 'IVA', accessor: 'iva' },
    { Header: 'Total sin IVA', accessor: 'total_sin_iva' },
    { Header: 'Fecha', accessor: 'fecha' },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>Listar los datos de todas las órdenes de pedido que contengan productos de la marca “COTO”.</h2>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default Query1;
