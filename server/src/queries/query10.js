/**
 * Se necesita crear una vista que devuelva los datos de las órdenes de pedido ordenadas por fecha 
 * (incluyendo la razón social del proveedor y el total de la orden sin y con IVA).
 */
const { getDB } = require('../lib/mongo');
const { subscribe } = require('../utils/cacheDependency');

const key_prefix = "query7";
const proveedores = "proveedores";
const ops = "ops";
const detalle_ops = "detalle_ops";
const productos = "productos";

module.exports = {
    getKey() {
        return key_prefix;
    },
    resources: [proveedores, ops, detalle_ops, productos],

    async execute() {
        const db = getDB();

        await db.command({
            create: "vista_ordenes_detalladas",
            viewOn: "ops",
            pipeline: [
            {
                $lookup: {
                    from: "detalle_ops",
                    localField: "id_pedido",
                    foreignField: "id_pedido",
                    as: "d"
                }
            },
            { $unwind: "$d" },
            {
                $lookup: {
                    from: "productos",
                    localField: "d.id_producto",
                    foreignField: "id_producto",
                    as: "prod"
                }
            },
            { $unwind: "$prod" },
            { $addFields: { subtotal: { $multiply: ["$prod.precio", "$d.cantidad"] } } },
            {
                $group: {
                    _id: "$id_pedido",
                    id_proveedor: { $first: "$id_proveedor" },
                    fecha: { $first: "$fecha" },
                    iva: { $first: "$iva" },
                    total_sin_iva: { $sum: "$subtotal" }
                }
            },
            {
                $addFields: {
                    total_con_iva: {
                        $add: [
                            "$total_sin_iva",
                            { $multiply: [ "$total_sin_iva", { $divide: ["$iva", 100] } ] }
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "proveedores",
                    localField: "id_proveedor",
                    foreignField: "id_proveedor",
                    as: "prov"
                }
            },
            { $unwind: "$prov" },
            {
                $project: {
                    _id: 0,
                    id_pedido: "$_id",
                    fecha: 1,
                    razon_social: "$prov.razon_social",
                    total_sin_iva: 1,
                    total_con_iva: 1
                }
            },
            { $sort: { fecha: 1 } }
        ]});

        const results = await db.collection("vista_ordenes_detalladas").find().toArray();

        subscribe(proveedores, key_prefix);
        subscribe(ops, key_prefix);
        subscribe(detalle_ops, key_prefix);
        subscribe(productos, key_prefix);

        return results;
    }
};