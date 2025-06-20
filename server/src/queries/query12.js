const { getDB } = require("../lib/mongo");
const { subscribe } = require("../utils/cacheDependency");
const proveedores = "proveedores";
const key_prefix = "query12";

module.exports = {
  getKey() {
    return key_prefix;
  },
  resources: [proveedores],
  async execute() {
    const db = getDB();
    const viewName = "vista_proveedores_activos_inhabilitados";

    const views = await db.listCollections({ name: viewName }).toArray();

    if (views.length === 0) {
      await db.createCollection(viewName, {
        viewOn: proveedores,
        pipeline: [
          {
            $match: {
              activo: 1,
              habilitado: 0,
            },
          },
        ],
      });
    }

    const result = await db.collection(viewName).find().toArray();
    subscribe(proveedores, key_prefix);
    return result;
  },
};
