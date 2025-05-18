const express = require('express');
const router = express.Router();
const connection = require('../lib/db');

router.get('/', function(req, res, next) {
  res.render('dashboard/index', { messages: {} });
});

module.exports = router;