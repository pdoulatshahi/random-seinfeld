const {mongoose} = require('./../../db/mongoose');
const {SuggestedVideo} = require('./../../models/suggestedVideo');

const passport = require('./../../config/passport');

const getYouTubeId = require('get-youtube-id');

const express = require('express');
var router = express.Router();

module.exports = function(passport) {
  router.get('/', ensureAuthenticated, (req, res) => {
    SuggestedVideo.find({}).then((suggestedVideos) => {
      res.render('admin/suggest/index', {suggestedVideos, pageTitle: 'All Suggested Videos'})
    }, (e) => {
      res.status(400).send(e);
    })
  })
  return router;
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); }
  // denied. redirect to login
  res.redirect('/admin/login');
}
