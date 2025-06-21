const srv = require('../services/operacionSrv');

async function create(req, res, next) {
  try {
    const nuevo = await srv.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) { next(err); }
}


module.exports = { create };
