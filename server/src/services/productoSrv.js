const { getDB } = require('../lib/mongo');
const { getRedis } = require('../lib/redis');
const { ObjectId } = require('mongodb');
const TTL = 300;

async function getAll() {
  const redis = getRedis();
  const cacheKey = 'productos:all';

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const db = getDB();
  const docs = await db.collection('productos').find().toArray();

  await redis.set(cacheKey, JSON.stringify(docs), { EX: TTL });
  return docs;
}

async function create(data) {
  const db = getDB();
  const result = await db.collection('productos').insertOne(data);

  await getRedis().del('productos:all');

  return { _id: result.insertedId, ...data };
}

async function update(id, data) {
  const db = getDB();
  const result = await db.collection('productos').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: data },
    { returnDocument: 'after' } 
  );

  await getRedis().del('productos:all');
  return result.value;
}

async function remove(id) {
  const db = getDB();
  await db.collection('productos').deleteOne({ _id: new ObjectId(id) });
  await getRedis().del('productos:all');
}

module.exports = { getAll, create, update, remove };
