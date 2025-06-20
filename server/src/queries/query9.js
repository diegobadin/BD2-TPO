const { getDB } = require("../lib/mongo");
const { subscribe } = require("../utils/cacheDependency");
const operaciones = "ops";
const detalle_operaciones = "detalle_ops";
const productos = "productos";
const key_prefix = "query9";

module.exports = {
  getKey({ query }) {
    return key_prefix + ":" + query.marca;
  },
  resources: [productos],
  async execute({ query }) {
    const db = getDB();

    if (!query.marca) throw new Error("Falta el parámetro 'marca'");

    console.log(query.marca);

    const results = await db
      .collection(productos)
      .aggregate([
        {
          $match: { marca: query.marca },
        },
        {
          $lookup: {
            from: detalle_operaciones,
            localField: "id_producto",
            foreignField: "id_producto",
            as: "detalles",
          },
        },
        { $unwind: "$detalles" },

        {
          $lookup: {
            from: operaciones,
            localField: "detalles.id_pedido",
            foreignField: "id_pedido",
            as: "orden",
          },
        },
        { $unwind: "$orden" },

        {
          $group: {
            _id: "$orden.id_pedido",
            id_proveedor: { $first: "$orden.id_proveedor" },
            fecha: { $first: "$orden.fecha" },
            total_sin_iva: { $first: "$orden.total_sin_iva" },
            iva: { $first: "$orden.iva" },
          },
        },
        {
          $project: {
            _id: 0,
            id_pedido: "$_id",
            id_proveedor: 1,
            fecha: 1,
            total_sin_iva: 1,
            iva: 1,
          },
        },
      ])
      .toArray();

    subscribe(operaciones, key_prefix + ":" + query.marca);
    subscribe(detalle_operaciones, key_prefix + ":" + query.marca);
    subscribe(productos, key_prefix + ":" + query.marca);
    return results;
  },
};
