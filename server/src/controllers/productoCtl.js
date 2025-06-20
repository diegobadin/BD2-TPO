const srv = require('../services/productoSrv');

async function getAll(req, res, next) {
  try {
    const lista = await srv.getAll();
    res.json(lista);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const nuevo = await srv.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const upd = await srv.update(req.params.id, req.body);
    res.json(upd);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await srv.remove(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
}

module.exports = { getAll, create, update, remove };
