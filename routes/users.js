var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('./user/first-page',{userhd:true})
});

module.exports = router;
