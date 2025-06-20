const Producto = require('../models/Producto');
const { getRedis } = require('../lib/redis');
const TTL = 300; 

async function getAll() {
  const redis = getRedis();
  const cacheKey = 'productos:all';
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const docs = await Producto.find().lean();
  await redis.set(cacheKey, JSON.stringify(docs), { EX: TTL });
  return docs;
}

async function create(data) {
  const p = await Producto.create(data);
  await getRedis().del('productos:all');
  return p;
}

async function update(id, data) {
  const p = await Producto.findByIdAndUpdate(id, data, { new: true });
  await getRedis().del('productos:all');
  return p;
}

async function remove(id) {
  await Producto.findByIdAndDelete(id);
  await getRedis().del('productos:all');
}

module.exports = { getAll, create, update, remove };