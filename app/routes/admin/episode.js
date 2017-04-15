const {mongoose} = require('./../../db/mongoose');
const {Episode} = require('./../../models/episode');

const passport = require('./../../config/passport');

const _ = require('lodash');

const express = require('express');
var router = express.Router({mergeParams: true});

module.exports = function(passport) {
  router.get('/', ensureAuthenticated, (req, res) => {
    Episode.find({}).then((episodes) => {
      if (!episodes) {
        res.status(400).send('Episodes not found');
      }
      var episodes = _.sortBy(episodes, 'episode');
      episodes = _.groupBy(episodes, 'season');
      res.render('admin/episodes/index', {episodes, pageTitle: 'All Episodes'});
    }).catch((err) => {
      console.log(err);
      res.status(400).send(err);
    })
  });

  router.get('/:slug/edit', ensureAuthenticated, (req, res) => {
    Episode.findOne({'slug': req.params.slug}).then((episode) => {
      if (!episode) {
        req.flash('error', 'No Episode');
        res.redirect('/admin/episodes');
      }
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
        res.redirect('/admin/episodes/');
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
