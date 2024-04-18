var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/movies', require('./movies'));
router.use('/genres', require('./genres'));
router.use('/auth', require('./auth'));

module.exports = router;
