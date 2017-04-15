const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');
const {Video} = require('./../models/video');
const {SuggestedVideo} = require('./../models/suggestedVideo');
const {Tag} = require('./../models/tag');

const passport = require('./../config/passport');

const getYouTubeId = require('get-youtube-id');
const slug = require('slug');
const async = require('async');

const express = require('express');
var router = express.Router();

module.exports = function(passport) {
  router.get('/', ensureAuthenticated, (req, res) => {
    res.render('admin/index', {pageTitle: 'Admin Dashboard'});
  })

  router.get('/login', (req, res) => {
    res.render('admin/login', {messages: req.flash(), pageTitle: 'Admin Login'});
  })

  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true,
  }));

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/admin/login');
  });

  const episodeAdminRoutes = require('./admin/episode');
  router.use('/episodes', episodeAdminRoutes(passport));

  const videoAdminRoutes = require('./admin/video');
  router.use('/videos', videoAdminRoutes(passport));

  const tagAdminRoutes = require('./admin/tag');
  router.use('/tags', tagAdminRoutes(passport));

  const suggestedVideoAdminRoutes = require('./admin/suggestedVideo');
  router.use('/suggested-videos', suggestedVideoAdminRoutes(passport));


  return router;
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); }
  // denied. redirect to login
  res.redirect('/admin/login');
}
