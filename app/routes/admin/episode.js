const {mongoose} = require('./../../db/mongoose');
const {Episode} = require('./../../models/episode');

const passport = require('./../../config/passport');
const express = require('express');
var router = express.Router({mergeParams: true});

module.exports = function(passport) {
  router.get('/', ensureAuthenticated, (req, res) => {
    res.render('admin/episodes/index', {pageTitle: 'All Episodes'})
  })

  router.get('/season/:number', ensureAuthenticated, (req, res) => {
    var season = req.params.number;
    Episode.find({season}).sort('episode').then((episodes) => {
      var pageTitle = "Episodes: Season " + season;
      res.render('admin/episodes/season/index', {episodes, pageTitle});
    })
  })

  router.get('/:slug/edit', ensureAuthenticated, (req, res) => {
    Episode.findOne({'slug': req.params.slug}).then((episode) => {
      res.render('admin/episodes/edit', {episode, pageTitle: 'Edit Episode'})
    })
  })

  router.post('/:slug/edit', ensureAuthenticated, (req, res) => {
    Episode.findOne({slug: req.params.slug}).then((episode) => {
      if (!episode) {
        req.flash('error', 'No episode found');
        res.redirect('/admin/episodes');
      }
      var updateParams = {
        firstAired: req.body.firstAired,
        imdbId: req.body.imdbId,
        imdbRating: req.body.imdbRating,
        summary: req.body.summary
      }
      episode.update(updateParams).then((savedEp) => {
        req.flash('success', 'Episode saved successfully');
        res.redirect('/admin/episodes/season/' + savedEp.season);
      })
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
