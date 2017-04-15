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
    Video.find({}).populate('tags _episode').then((videos) => {
      res.render('admin/videos/index', {videos, pageTitle: 'All Videos'});
    })
  })

  router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('admin/videos/form', {pageTitle: 'Add Video'})
  })

  router.post('/new', ensureAuthenticated, (req, res) => {
    var title = req.body.title;
    var titleSlug = slug(title).toLowerCase();
    var youTubeId = getYouTubeId(req.body.youtube_url);
    if (!youTubeId) {
      req.flash('error', 'Invalid or empty YouTube URL.');
      res.redirect('/admin/videos/new');
    } else {
      var video = new Video({title, slug: titleSlug, youTubeId});
    }
    var tagTitleArray = req.body.tags.split(", ");
    async.each(tagTitleArray, function(tagTitle, loopCallback) {
      Tag.findOne({title: tagTitle}).then((tag) => {
        if (!tag) {
          req.flash('error', 'Invalid tag provided');
          res.redirect('/admin/videos/new');
        } else {
          video.tags.push(tag._id);
          loopCallback();
        }
      });
    }, function(err) {
      if (err) { res.status(400).send(e) }
      var episodeTitle = req.body.episode_title;
      Episode.findOne({title: episodeTitle}).then((ep) => {
        if (ep) {
          video._episode = ep._id;
        }
        video.save().then((savedVid) => {
          if (video._episode) {
            ep.videos.push(savedVid._id);
            ep.save().then((savedEp) => {
              async.each(savedVid.tags, function(tagId, loopCallback) {
                Tag.findById(tagId).then((tag) => {
                  tag.videos.push(savedVid._id);
                  tag.save();
                  loopCallback();
                })
              }, function(err){
                res.redirect('/admin/videos');
              })
            })
          } else {
            async.each(savedVid.tags, function(tagId, loopCallback) {
              Tag.findById(tagId).then((tag) => {
                tag.videos.push(savedVid._id);
                tag.save();
                loopCallback();
              })
            }, function(err){
              res.redirect('/admin/videos');
            })
          }
        })
      });
    });
  });

  router.get('/:slug/edit', ensureAuthenticated, (req, res) => {
    Video.find({slug: req.params.slug}).populate('_episode tags').then((video) => {
      if (!video) {
        req.flash('error', 'No video found.');
        res.redirect('/admin/videos');
      } else {
        console.log(video);
        res.render('admin/videos/form', {video, pageTitle: 'Edit Video'});
      }
    }, (e) => {
      res.status(400).send(e);
    })
  })

  router.post('/videos/:id/edit', ensureAuthenticated, (req, res) => {
    var id = req.params.id;
    Video.findById(id).then((video) => {
      if (!video) {
        req.flash('error', 'No video found.');
        res.redirect('/admin/videos');
      } else {
        Video.update({ _id: id}, {})
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
