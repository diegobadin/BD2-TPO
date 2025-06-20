/**
 * Mostrar los productos que han sido pedidos al menos 1 vez.
 */

const { getDB } = require("../lib/mongo");
const { subscribe } = require("../utils/cacheDependency");
const productos = "productos";
const key_prefix = "query8";

module.exports = {
  getKey() {
    return key_prefix;
  },
  resources: [productos],
  async execute() {
    const db = getDB();

    const results = await db
      .collection("productos")
      .aggregate([
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
            as: "existe",
          },
        },
        {
          $match: { "existe.0": { $exists: true } },
        },
        {
          $project: {
            _id: 0,
            id_producto: "$id_producto",
            descripcion: 1,
            marca: 1,
            categoria: 1,
            precio: 1,
            stock_actual: 1,
            stock_futuro: 1,
          },
        },
      ])
      .toArray();

    subscribe("productos", key_prefix);
    return results;
  },
};
