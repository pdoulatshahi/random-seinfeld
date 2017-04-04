const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');

const passport = require('./../config/passport');

const express = require('express');
var router = express.Router();

module.exports = function(passport) {
  router.get('/login', (req, res) => {
    res.render('login', {messages: req.flash()});
  })

  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true,
  }));

  return router;
}
