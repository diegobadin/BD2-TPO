/**
 * Identificar todos los proveedores que NO tengan registrada ninguna orden de pedido. 
 * Es importante conocer su estado (¿el proveedor está activo?, ¿está habilitado?)
 */
const { getDB } = require('../lib/mongo');
const { subscribe } = require('../utils/cacheDependency');
const key_prefix = "query5";

module.exports = {
    getKey() {
    return key_prefix 
    },
    resources: ["proveedores", "ordenes"],
    async execute() {
        const db = await getDB();
        const results = await db
        .collection("proveedores")
        .aggregate([
          {
            $lookup: {
              from: "ordenes", 
              localField: "id_proveedor", 
              foreignField: "id_proveedor", 
              as: "ordenes",
            },
          },
          {
            $match: {
              ordenes: { $size: 0 },
            },
          },
          {
            $project: {
              _id: 0,
              id_proveedor: 1,
              activo: 1,
              habilitado: 1,
            },
          },
        ])
        .toArray();

      subscribe("proveedores", key_prefix);
      subscribe("ordenar", key_prefix);
      return results;
    }
};