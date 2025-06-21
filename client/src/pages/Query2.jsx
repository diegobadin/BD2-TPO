import React, { useEffect, useState } from 'react';
import { fetchQueryWithParam } from '../services/api';
import Table from '../components/Table';

function Query1() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchQueryWithParam(2, 'word=Tecnología')
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
    { Header: 'ID prov', accessor: 'id_proveedor' },
    { Header: 'Razón Social', accessor: 'razon_social' },
    { Header: 'Teléfonos', accessor: 'telefonos' },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>Obtener el/los teléfono/s y el código del/los proveedor/es que contengan la palabra “Tecnología” en su razón social.</h2>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default Query1;
