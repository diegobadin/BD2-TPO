const { getDB } = require('../lib/mongo');
const { subscribe } = require('../utils/cacheDependency');
const proveedores = "proveedores";
module.exports = {
  key: 'query2',
  resources: [proveedores],
  async execute({ query }) {
        const db = getDB();
        
        if (!query.word) throw error();

        const regex = new RegExp(query.word, 'i'); 

        const results = await db.collection(proveedores).find(
            { razon_social: regex },
            { projection: {_id: 0, id_proveedor: 1, razon_social: 1, telefonos: 1}}
        ).toArray();

        subscribe(proveedores, 'query2');
        return results;
    }
};