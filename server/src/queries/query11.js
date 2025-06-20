/**
 * Crear una vista que devuelva todos los productos que aún NO han sido pedidos.
 */

const { getDB } = require("../lib/mongo");
const { subscribe } = require("../utils/cacheDependency");
const key_prefix = "query11";
const viewName = "productos_no_pedidos";

module.exports = {
  getKey() {
    return key_prefix;
  },
  resources: ["productos", "detalle_ops", "ops"],
  async execute() {
    const db = getDB();
    const existing = await db.listCollections({ name: viewName }).toArray();

    if (existing.length === 0) {
      db.command({
        create: viewName,
        viewOn: "productos",
        pipeline: [
          {
            $lookup: {
              from: "detalle_ops",
              let: { pid: "$id_producto" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$id_producto", "$$pid"] },
                  },
                },
                { $limit: 1 },
              ],
              as: "pedidos",
            },
          },
          {
            $match: {
              "pedidos.0": { $exists: false },
            },
          },
          {
            $project: {
              _id: 0,
              id_producto: 1,
              descripcion: 1,
              marca: 1,
              categoria: 1,
              precio: 1,
              stock_actual: 1,
              stock_futuro: 1,
            },
          },
        ],
      });
    }

    subscribe("productos", key_prefix);
    subscribe("ops", key_prefix);
    subscribe("detalle_ops", key_prefix);
    return await db.collection(viewName).find().toArray();
  },
};
