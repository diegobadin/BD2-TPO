const srv = require('../services/querySrv');

async function get(req, res, next) {
  try {
    const lista = await srv.get(req, res, next);
    res.json(lista);
  } catch (err) { next(err); }
}


module.exports = { get };
