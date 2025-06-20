const { getDB } = require('../lib/mongo');
const { subscribe } = require('../utils/cacheDependency');
const proveedores = "proveedores";
const key_prefix = "query3";

module.exports = {
    getKey() {
        return key_prefix;
    },
    resources: [proveedores],
    async execute() {
        const db = getDB();

        const results = await db.collection(proveedores).aggregate([
            { $unwind: "$telefonos" },
            {
                $project: {
                    _id: 0,
                    telefono: "$telefonos",
                    id_proveedor: 1,
                    CUIT_proveedor: 1,
                    razon_social: 1,
                    tipo_sociedad: 1,
                    direccion: 1,
                    activo: 1,
                    habilitado: 1,
                }
            }]).toArray();
        subscribe(proveedores, key_prefix);
        return results;
    }
};