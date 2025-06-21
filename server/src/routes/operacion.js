const router = require('express').Router();
const ctl = require('../controllers/operacionCtl');

router.post('/', ctl.create);

module.exports = router;