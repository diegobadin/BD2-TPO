/**
 * Se necesita crear una vista que devuelva los datos de las órdenes de pedido ordenadas por fecha
 * (incluyendo la razón social del proveedor y el total de la orden sin y con IVA).
 */
const { getDB } = require("../lib/mongo");
const { subscribe } = require("../utils/cacheDependency");

const key_prefix = "query10";
const proveedores = "proveedores";
const ops = "ops";
const detalle_ops = "detalle_ops";
const productos = "productos";
const viewName = "vista_ordenes_detalladas";

module.exports = {
  getKey() {
    return key_prefix;
  },
  resources: [proveedores, ops, detalle_ops, productos],

  async execute() {
    const db = getDB();
    const existing = await db.listCollections({ name: viewName }).toArray();

    if (existing.length === 0) {
      await db.command({
        create: viewName,
        viewOn: "ops",
        pipeline: [
          {
            $addFields: {
              total_con_iva: {
                $add: [
                  "$total_sin_iva",
                  { $multiply: ["$total_sin_iva", { $divide: ["$iva", 100] }] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "proveedores",
              localField: "id_proveedor",
              foreignField: "id_proveedor",
              as: "prov",
            },
          },
          { $unwind: "$prov" },
          {
            $addFields: {
              fechaDate: {
                $dateFromString: {
                  dateString: { $trim: { input: "$fecha" } },
                  format: "%d/%m/%Y"
                }
              },
            },
          },
          {
            $project: {
              _id: 0,
              id_pedido: "$id_pedido",
              razon_social: "$prov.razon_social",
              fechaDate: 1,
              fecha_original: "$fecha", 
              total_sin_iva: { $round: ["$total_sin_iva", 2] },
              total_con_iva: { $round: ["$total_con_iva", 2] },
            },
          },
          {
            $sort: { fechaDate: 1 },
          },
        ],
      });
    }

    subscribe(proveedores, key_prefix);
    subscribe(ops, key_prefix);
    subscribe(detalle_ops, key_prefix);
    subscribe(productos, key_prefix);

    return await db.collection(viewName).find().toArray();
  },
};
