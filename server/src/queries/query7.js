/**
 * Listar los datos de todas las órdenes que hayan sido pedidas al proveedor cuyo CUIT es 30-66060817-5.
 */
const { getDB } = require('../lib/mongo');
const { subscribe } = require('../utils/cacheDependency');

const key_prefix = "query7";
const proveedores = "proveedores";
const ops = "ops";

module.exports = {
    getKey({ query }) {
    return key_prefix + ':' + query.cuit;
    },
    resources: [proveedores, ops],
    async execute({ query }) {
        const db = getDB();
        if (!query.cuit) throw new Error("Falta el parámetro 'CUIT'");
        const cuitLong = Number(query.cuit);
    
        const results = await db.collection(ops).aggregate([
            {
                $lookup: {
                    from: proveedores,
                    localField: "id_proveedor",
                    foreignField: "id_proveedor",
                    as: "p"
                }
            },
            { $unwind: "$p" },
            { $match: { "p.CUIT_proveedor": cuitLong } },
            {   $project: {
                    _id: 0,
                    id_pedido: 1,
                    fecha: 1,
                    total_sin_iva: 1,
                    total_con_iva: {
                        $add: [
                            "$total_sin_iva",
                            {
                            $multiply: [
                                "$total_sin_iva",
                                { $divide: ["$iva", 100] }
                            ]
                            }
                        ]
                    }
                } 
            }
            
        ]).toArray();

        subscribe(proveedores, key_prefix + ":" + query.cuit);
        subscribe(ops, key_prefix + ":" + query.cuit);
        return results;
    }
};