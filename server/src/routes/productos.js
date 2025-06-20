const router = require('express').Router();
const ctl = require('../controllers/productoCtl');

router.post('/', ctl.create);
router.put('/:id', ctl.update);
router.delete('/:id', ctl.remove);

module.exports = router;