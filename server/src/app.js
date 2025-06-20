require('dotenv').config();
const express = require('express');
const { connectMongo } = require('./lib/mongo');
const { connectRedis } = require('./lib/redis');

const productosR = require('./routes/productos');
//const proveedoresR = require('./routes/proveedores');
//const ordenesR = require('./routes/ordenes');

async function bootstrap() {
  await connectMongo();
  await connectRedis();

  const app = express();
  app.use(express.json());

  // Rutas
  app.use('/api/productos', productosR);
  //app.use('/api/proveedores', proveedoresR);
//  app.use('/api/ordenes', ordenesR);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
}

bootstrap();