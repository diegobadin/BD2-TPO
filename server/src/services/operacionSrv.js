const { getDB } = require("../lib/mongo");
const { ObjectId } = require("mongodb");
const { markDirty } = require("../utils/cacheDependency");
const operaciones = "ops";
const detalle_operaciones = "detalle_ops";
async function create(data) {
  const db = getDB();

  const { id_pedido, id_proveedor, fecha, iva, detalles } = data;

  const proveedor = await db.collection("proveedores").findOne({
    id_proveedor,
    activo: 1,
    habilitado: 1,
  });

  if (!proveedor) {
    throw new Error(
      `El proveedor ${id_proveedor} no está activo y habilitado.`
    );
  }

  const idsProductos = detalles.map((d) => d.id_producto);
  const productos = await db
    .collection("productos")
    .find({
      id_producto: { $in: idsProductos },
    })
    .toArray();

  if (productos.length !== idsProductos.length) {
    throw new Error("Uno o más productos no existen.");
  }

  const productosMap = {};
  for (const prod of productos) {
    productosMap[prod.id_producto] = prod;
  }

  let total_sin_iva = 0;
  const updatesStock = [];

  for (const det of detalles) {
    const producto = productosMap[det.id_producto];

    const subtotal = producto.precio * det.cantidad;
    total_sin_iva += subtotal;

    const nuevoStockFuturo =
      (producto.stock_futuro === 0
        ? producto.stock_actual
        : producto.stock_futuro) + det.cantidad;

    updatesStock.push({
      id_producto: det.id_producto,
      nuevoStockFuturo,
    });
  }

  const total_con_iva = +(total_sin_iva * (1 + iva / 100)).toFixed(2);

  const result = await db.collection(operaciones).insertOne({
    id_pedido,
    id_proveedor,
    fecha,
    total_sin_iva,
    iva,
  });


  if (result.acknowledged && result.insertedId) {
    console.log("Orden insertada con ID:", result.insertedId);
  } else {
    throw new Error("Falló la inserción de la orden.");
  }

  const detallesConPedido = detalles.map((d) => ({
    ...d,
    id_pedido,
  }));

  await db.collection(detalle_operaciones).insertMany(detallesConPedido);

  const bulkUpdates = updatesStock.map(({ id_producto, nuevoStockFuturo }) => ({
    updateOne: {
      filter: { id_producto },
      update: { $set: { stock_futuro: nuevoStockFuturo } },
    },
  }));

  await db.collection("productos").bulkWrite(bulkUpdates);

  markDirty(productos);
  markDirty(operaciones);
  markDirty(detalle_operaciones);

  return {
    success: true,
    mensaje: "Orden registrada, detalles guardados y stock futuro actualizado.",
    _id_operacion : result.insertedId,
    id_pedido,
  };
}

module.exports = { create };
