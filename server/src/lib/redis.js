const { createClient } = require('redis');
let client;

async function connectRedis() {
  client = createClient({
    url: 'redis://redis:6379'
  });
  client.on('error', err => console.error('Redis Error', err));
  await client.connect();
  console.log('Conectado a Redis');
}

function getRedis() {
  if (!client) throw new Error('Redis no inicializado');
  return client;
}

module.exports = { connectRedis, getRedis };