
db.productos.createIndex({ id_producto: 1 }, { unique: true });
db.ops.createIndex({ id_pedido: 1 }, { unique: true });
db.proveedores.createIndex({ id_proveedor: 1 }, { unique: true });


const resultados = db.detalle_ops.aggregate([
  {
    $lookup: {
      from: "productos",
      localField: "id_producto",
      foreignField: "id_producto",
      as: "producto"
    }
  },
  { $unwind: "$producto" },
  {
    $group: {
      _id: "$id_pedido",
      total_sin_iva: {
        $sum: {
          $multiply: ["$cantidad", "$producto.precio"]
        }
      }
    }
  }
]).toArray();

const bulk = resultados.map(r => ({
  updateOne: {
    filter: { id_pedido: r._id },
    update: { $set: { total_sin_iva: r.total_sin_iva } }
  }
}));

db.ops.bulkWrite(bulk);

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

