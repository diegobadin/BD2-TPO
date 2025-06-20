/**
 * Obtener los datos de los proveedores activos y habilitados junto con sus teléfonos.
 */
const { getDB } = require('../lib/mongo');
const { subscribe } = require('../utils/cacheDependency');

const key_prefix = "query1";
const proveedores = "proveedores";

module.exports = {
    getKey() {
        return key_prefix;
    },
    resources: [proveedores],

    async execute() {
        const db = getDB();

        const results = db.collection(proveedores).find(
            { activo: 1, habilitado: 1 },
            { $project: { 
                _id: 0, 
                id_proveedor: 1, 
                CUIT_proveedor: 1, 
                razon_social: 1, 
                tipo_sociedad: 1, 
                direccion: 1, 
                telefonos: 1 } 
            }
        ).toArray();

        subscribe(proveedores, key_prefix);

        return results;
    }
};