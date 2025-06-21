require('dotenv').config();
const express = require('express');
const { connectMongo } = require('./lib/mongo');
const { connectRedis } = require('./lib/redis');
const cors = require('cors');

const productosR = require('./routes/productos');
const queryR = require('./routes/query');

async function bootstrap() {
  await connectMongo();
  await connectRedis();

  const app = express();

  app.use(express.json());
/*  app.set('trust proxy', 1);
  app.use(cors({
    origin: 'https://psychic-couscous-r9p4qq6pvwp2p9g9-3000.app.github.dev',
    credentials: true,
  }));
*/
  app.use('/api/productos', productosR);
  app.use('/api/query', queryR);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
}

bootstrap();
