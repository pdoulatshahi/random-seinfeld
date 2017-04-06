const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');
const {Video} = require('./../models/video');

const passport = require('./../config/passport');

const getYouTubeId = require('get-youtube-id');

const express = require('express');
var router = express.Router();

module.exports = function(passport) {
  router.get('/', ensureAuthenticated, (req, res) => {
    res.render('admin/index');
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

  router.get('/episodes', ensureAuthenticated, (req, res) => {
    Episode.find({}).then((episodes) => {
      res.render('admin/episodes/index', {episodes})
    })
  })

  router.get('/episodes/:slug/edit', ensureAuthenticated, (req, res) => {
    Episode.findOne({'slug': req.params.slug}).then((episode) => {
      res.render('admin/episodes/edit', {episode})
    })
  })

  router.get('/videos', ensureAuthenticated, (req, res) => {
    Video.find({}).then((videos) => {
      res.render('admin/videos/index', {videos});
    })
  })

  router.get('/videos/new', ensureAuthenticated, (req, res) => {
    res.render('admin/videos/new')
  })

  router.post('/videos/new', ensureAuthenticated, (req, res) => {
    var video = new Video();
    video.youTubeId = getYouTubeId(req.body.youtube_url);
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
