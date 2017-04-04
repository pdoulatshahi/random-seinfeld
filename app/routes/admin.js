const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');
const {Video} = require('./../models/video');

const passport = require('./../config/passport');

const getYouTubeID = require('get-youtube-id');

const express = require('express');
var router = express.Router();

module.exports = function(passport) {
  router.get('/', ensureAuthenticated, (req, res) => {
    res.render('admin');
  })

  router.get('/login', (req, res) => {
    res.render('login', {messages: req.flash()});
  })

  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true,
  }));

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/admin/login')
  });

  router.get('/videos', (req, res) => {
    Video.find({}).then((videos) => {
      res.render('admin/video/index', {videos});
    })

  })

  router.get('/video/new', ensureAuthenticated, (req, res) => {
    res.render('admin/video/new')
  })

  router.post('/video/new', ensureAuthenticated, (req, res) => {
    var video = new Video();
    video.youTubeId = getYouTubeID(req.body.youtube_url);
    var episode = Episode.findOne({'title': req.body.episode_title}).then((ep) => {
      if (!ep) return res.status(404).send();
      video._episode = ep._id;
      video.save().then((vid) => {
        ep.videos.push(vid._id);
        ep.save().then((newEp) => {
          res.redirect('/admin');
        }, (e) => {
          res.status(400).send(e);
        });
      }, (e) => {
        res.status(400).send(e);
      });
    })

  });

  return router;
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next(); }

  // denied. redirect to login
  res.redirect('/admin/login');
}
