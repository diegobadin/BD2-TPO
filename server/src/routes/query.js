const router = require('express').Router();
const ctl = require('../controllers/queryCtl');

router.get('/:id', ctl.get);

module.exports = router;
