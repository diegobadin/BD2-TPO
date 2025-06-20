const { MongoClient } = require('mongodb');

let client;
let db;

async function connectMongo() {
  const uri = process.env.MONGO_URI || 'mongodb://mongo:27017/tpo_g7';
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(); 
  console.log('Conectado a MongoDB');
}

function getDB() {
  if (!db) throw new Error('Mongo no inicializado');
  return db;
}

module.exports = { connectMongo, getDB };