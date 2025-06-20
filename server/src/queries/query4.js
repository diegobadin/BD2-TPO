/**
 * Obtener todos los proveedores que tengan registrada al menos una orden de pedido.
 */
const { getDB } = require('../lib/mongo');
const { subscribe } = require('../utils/cacheDependency');

const key_prefix = "query4";
const proveedores = "proveedores";
const ops = "ops";

module.exports = {
    getKey() {
        return key_prefix;
    },
    resources: [proveedores, ops],

    async execute() {
        const db = getDB();

        const results = db.collection(proveedores).aggregate([
            {
                $lookup: {
                    from: "ops",
                    localField: "id_proveedor",
                    foreignField: "id_proveedor",
                    as: "o"
                }
            },
            { $match: { "o.0": { $exists: true } } },
            { $project: { _id: 0, id_proveedor: 1, CUIT_proveedor: 1, razon_social: 1, tipo_sociedad: 1, direccion: 1, telefonos: 1} }
        ]).toArray();

        subscribe(proveedores, key_prefix);
        subscribe(ops, key_prefix);

        return results;
    }
};