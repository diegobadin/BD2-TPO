const mongoose = require('mongoose');

async function connectMongo() {
  const uri = process.env.MONGO_URI || 'mongodb://mongo:27017/tpo_g7';
  await mongoose.connect(uri);
  console.log('Conectado a MongoDB');
}

module.exports = { connectMongo };