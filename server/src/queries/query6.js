const { getDB } = require('../lib/mongo');
const { subscribe } = require('../utils/cacheDependency');
const proveedores = "proveedores";
const operaciones = "ops";
const key_prefix = "query6";

module.exports = {
    getKey() {
        return key_prefix;
    },
    resources: [proveedores],
    async execute() {
        const db = getDB();

        const results = await db.collection(proveedores).aggregate([
            {
                $lookup: {
                    from: operaciones,
                    localField: 'id_proveedor',
                    foreignField: 'id_proveedor',
                    as: 'operaciones'
                }
            },
            {
                $project: {
                    _id: 0,
                    id_proveedor: 1,
                    razon_social: 1,
                    cantidad_operaciones: { $size: "$operaciones" },
                    total_sin_iva: {
                        $sum: "$operaciones.total_sin_iva"
                    },
                    total_con_iva: {
                        $sum: {
                            $map: {
                                input: "$operaciones",
                                as: "op",
                                in: {
                                    $multiply: [
                                        "$$op.total_sin_iva",
                                        { $add: [1, { $divide: ["$$op.iva", 100] }] }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]).toArray();
        subscribe(proveedores, key_prefix);
        subscribe(operaciones, key_prefix);
        return results;
    }
};