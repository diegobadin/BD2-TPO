const { getDB } = require('../lib/mongo');
const { subscribe } = require('../utils/cacheDependency');
const proveedores = "proveedores";
const key_prefix = "query2";

module.exports = {
  getKey({ query }) {
    return key_prefix+ ':' + query.word;
  },
  resources: [proveedores],
  async execute({ query }) {
        const db = getDB();
        
        if (!query.word) throw new Error("Falta el parámetro 'word'");

       const results = await db.collection(proveedores).find(
        {razon_social: { $regex: query.word, $options: 'i' }},
        { projection: { _id: 0, id_proveedor: 1, razon_social: 1, telefonos: 1 } }
        ).toArray();
        console.log(results);
        subscribe(proveedores, key_prefix+":"+query.word);
        return results;
    }
};