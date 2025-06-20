const { getDB } = require('../lib/mongo');
const { subscribe } = require('../utils/cacheDependency');
const operaciones = "ops";
const detalle_operaciones = "detalle_ops";
const productos = "productos";
const key_prefix = "query9";

module.exports = {
    getKey({ query }) {
        return key_prefix+ ':' + query.marca;
    },
    resources: [proveedores],
    async execute({ query }) {
        const db = getDB();

        if (!query.marca) throw new Error("Falta el parámetro 'marca'");

        const results = await db.collection(operaciones).agregate([[
            {
                $lookup: {
                    from: detalle_operaciones,
                    localField: 'id_orden',
                    foreignField: 'id_orden',
                    as: 'detalles'
                }
            },
            { $unwind: "$detalles" },

            {
                $lookup: {
                    from: productos,
                    localField: 'detalles.id_producto',
                    foreignField: 'id_producto',
                    as: 'producto_info'
                }
            },
            { $unwind: "$producto_info" },

            {
                $match: {
                    "producto_info.marca": query.marca
                }
            },

            {
                $group: {
                    _id: "$id_pedido",
                    id_proveedor: "$id_proveedor",
                    fecha: "$fecha" ,
                    total_sin_iva:  "$total_sin_iva" ,
                    iva: "$iva"
                }
            },
        ]]).toArray();
        console.log(results);
        subscribe(operaciones, key_prefix+":"+query.marca);
        subscribe(detalle_operaciones, key_prefix+":"+query.marca);
        subscribe(productos, key_prefix+":"+query.marca);
        return results;
    }
};