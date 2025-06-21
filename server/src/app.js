require('dotenv').config();
const express = require('express');
const { connectMongo } = require('./lib/mongo');
const { connectRedis } = require('./lib/redis');

const productosR = require('./routes/productos');
const queryR = require('./routes/query');
const operacionR = require('./routes/operacion');

const proveedorR = require('./routes/proveedor');

async function bootstrap() {
  await connectMongo();
  await connectRedis();

  const app = express();
  app.use(express.json());

  app.use('/api/productos', productosR);
  app.use('/api/query', queryR);
  app.use('/api/operacion', operacionR);
  app.use('/api/proveedor', proveedorR);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
}

bootstrap();