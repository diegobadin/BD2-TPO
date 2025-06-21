const { getDB } = require('../lib/mongo');
const { markDirty } = require('../utils/cacheDependency');

async function create(data) {
  const db = getDB();
  const result = await db.collection('productos').insertOne(data);

  await markDirty('productos');

  return { _id: result.insertedId, ...data };
}

async function update(id, data) {
  const db = getDB();

  const result = await db.collection('productos').findOneAndUpdate(
    { id_producto: Number(id) },        
    { $set: data },
    { returnDocument: 'after' }         
  );

  await markDirty('productos');

  return result.value; 
}

async function remove(id) {
  const db = getDB();
  await db.collection('productos').deleteOne({ id_producto: Number(id) });
  await markDirty('productos');
}

module.exports = { create, update, remove };
