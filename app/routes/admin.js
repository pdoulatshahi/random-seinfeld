const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');

const express = require('express');
var router = express.Router();

const seasonArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/login', (req, res) => {
  console.log(req.body);
})

module.exports = router;
