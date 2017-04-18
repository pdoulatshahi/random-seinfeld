const {mongoose} = require('./../../db/mongoose');
const {Episode} = require('./../../models/episode');
const {Video} = require('./../../models/video');
const {SuggestedVideo} = require('./../../models/suggestedVideo');
const {Tag} = require('./../../models/tag');

const passport = require('./../../config/passport');

const getYouTubeId = require('get-youtube-id');
const slug = require('slug');
const async = require('async');

const express = require('express');
var router = express.Router();

module.exports = function(passport) {
  router.get('/', ensureAuthenticated, (req, res) => {
    Video.find({}).populate('_episode tags').then((videos) => {
      res.render('admin/videos/index', {videos, pageTitle: 'All Videos'});
    })
  })

  router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('admin/videos/form', {pageTitle: 'Add Video'})
  })

  router.post('/new', ensureAuthenticated, (req, res) => {
    var youTubeId = getYouTubeId(req.body.youtube_url);
    if (!youTubeId) {
      req.flash('error', 'Invalid or empty YouTube URL.');
      res.redirect('/admin/videos/new');
    }
    var title = req.body.title;
    var titleSlug = slug(title);
    var video = new Video({title, slug: titleSlug, youTubeId});
    var tagTitleArray = req.body.tags.split(", ");
    Tag.find({title: {"$in": tagTitleArray}}).then((tags) => {
      var finalTagArray = [];
      tags.forEach((tag) => {
        finalTagArray.push(tag._id);
      });
      var episodeTitle = req.body.episode_title;
      Episode.findOne({title: episodeTitle}).then((ep) => {
        if (ep) {
          video._episode = ep._id;
        }
        video.tags = finalTagArray;
        video.save().then((savedVid) => {
          Tag.update({_id: {$in: savedVid.tags}}, {$push: {"videos": savedVid._id}}, {multi: true}).exec().then(() => {
            if (savedVid._episode) {
              Episode.findByIdAndUpdate(savedVid._episode, {$push: {"videos": savedVid._episode}}, {safe: true}, (err, model) => {
                if (err) throw err;
                req.flash('success', 'Video successfully saved');
                res.redirect('/admin/videos');
              })
            } else {
              req.flash('success', 'Video successfully saved');
              res.redirect('/admin/videos');
            }
          }).catch((e) => {
            res.status(400).send(e);
          })
        })
      }).catch((e) => {
        res.status(400).send(e);
      })
    }).catch((e) => {
      res.status(400).send(e);
    })
  });

  router.get('/:slug/edit', ensureAuthenticated, (req, res) => {
    Video.findOne({slug: req.params.slug}).populate('_episode').then((video) => {
      if (!video) {
        req.flash('error', 'No video found.');
        res.redirect('/admin/videos');
      }
      res.render('admin/videos/form', {video, pageTitle: 'Edit Video'});
    }, (e) => {
      res.status(400).send(e);
    })
  })

  router.post('/:slug/edit', ensureAuthenticated, (req, res) => {
    var existingParams = {'slug': req.params.slug};
    var video = Video.findOne(existingParams).populate('_episode').then((video) => {
      if (!video) {
        req.flash('error', 'Cannot find video');
        res.redirect('/admin/videos');
      }
      var title = req.body.title;
      var titleSlug = slug(title).toLowerCase();
      var youTubeId = getYouTubeId(req.body.youtube_url);
      if (!youTubeId) {
        req.flash('error', 'Invalid or empty YouTube URL.');
        res.redirect('/admin/videos/');
      }
      var tagTitleArray = req.body.tags.split(", ");
      Tag.find({title: {"$in": tagTitleArray}}).then((tags) => {
        var finalTagArray = [];
        tags.forEach((tag) => {
          finalTagArray.push(tag.title)
        });
        var episodeTitle = req.body.episode_title;
        Episode.findOne({title: episodeTitle}).then((ep) => {
          if (ep) {
            video._episode = ep._id;
          }
          video.title = title;
          video.slug = titleSlug;
          video.tags = finalTagArray;
          video.youTubeId = youTubeId;
          video.save().then((savedVid) => {
            console.log(savedVid);
            req.flash('success', 'Video saved');
            res.redirect('/admin/videos');
          })
        }).catch((e) => {
          res.status(400).send(e);
        })
      }).catch((e) => {
        res.status(400).send(e);
      })
    })
  });

  router.get('/:slug/delete', ensureAuthenticated, (req, res) => {
    Video.findOne({slug: req.params.slug}).then((video) => {
      if (!video) {
        req.flash('error', 'No video to delete');
        res.redirect('/admin/videos');
      } else {
        video.remove().then(() => {
          req.flash('success', 'Video deleted');
          res.redirect('/admin/videos');
        })
      }
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
