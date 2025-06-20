
db.productos.createIndex({ id_producto: 1 });
d.ops.createIndex({ id_pedido: 1 });
db.proveedores.createIndex({ id_proveedor: 1 });

db.telefonos_temp.find().forEach(function(tel) {
  db.proveedores.updateOne(
    { id_proveedor: tel.id_proveedor },
    {
      $push: {
        telefonos: {
          codigo_area: tel.codigo_area,
          nro_telefono: tel.nro_telefono,
          tipo: tel.tipo
        }
      }
    }
  );
});

db.telefonos_temp.drop();