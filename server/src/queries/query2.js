const { getDB } = require('../lib/mongo');
const { subscribe } = require('../utils/cacheDependency');

module.exports = {
  key: 'query2',
  resources: ['proveedores'],
  async execute(word) {
        const db = getDB();
        
        const regex = new RegExp(word, 'i'); 

        const results = await db.proveedores.find(
            { razon_social: regex },
            { projection: {_id: 0, id_proveedor: 1, razon_social: 1, telefonos: 1}}
        ).toArray();

        subscribe('proveedores', 'query2');
        return results;
    }
};