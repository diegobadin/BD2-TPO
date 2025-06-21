const srv = require('../services/proveedorSrv');


async function create(req, res, next) {
  try {
    const nuevo = await srv.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) { res.status(err.status || 500).json({ error: err.message }); }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id); 
    const upd = await srv.update(id, req.body);
    res.json(upd);
  } catch (err) { res.status(err.status || 500).json({ error: err.message }); }
}

async function remove(req, res, next) {
  try {
    await srv.remove(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
}

module.exports = { create, update, remove };
