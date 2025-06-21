import React, { useEffect, useState } from 'react';
import { fetchQuery } from '../services/api';
import Table from '../components/Table';

function Query1() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchQuery(8)
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
    { Header: 'ID producto', accessor: 'id_producto' },
    { Header: 'Categoria', accessor: 'categoria' },
    { Header: 'Descripçión', accessor: 'descripcion' },
    { Header: 'Marca', accessor: 'marca' },
    { Header: 'Precio', accessor: 'precio' },
    { Header: 'Stock Actual', accessor: 'stock_actual' },
    { Header: 'Stock Futuro', accessor: 'stock_futuro' },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>Mostrar los productos que han sido pedido al menos 1 vez.</h2>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default Query1;
