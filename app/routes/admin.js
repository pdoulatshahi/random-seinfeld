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

  router.get('/episodes', ensureAuthenticated, (req, res) => {
    res.render('admin/episodes/index', {pageTitle: 'All Episodes'})
  })

  router.get('/episodes/season/:number', ensureAuthenticated, (req, res) => {
    var season = req.params.number;
    Episode.find({season}).sort('episode').then((episodes) => {
      var pageTitle = "Episodes: Season " + season;
      res.render('admin/episodes/season/index', {episodes, pageTitle});
    })
  })

  router.get('/episodes/:slug/edit', ensureAuthenticated, (req, res) => {
    Episode.findOne({'slug': req.params.slug}).then((episode) => {
      res.render('admin/episodes/edit', {episode, pageTitle: 'Edit Episode'})
    })
  })

  router.post('/episodes/:slug/edit', ensureAuthenticated, (req, res) => {
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

  router.get('/videos', ensureAuthenticated, (req, res) => {
    Video.find({}).then((videos) => {
      res.render('admin/videos/index', {videos, pageTitle: 'All Videos'});
    })
  })

  router.get('/videos/new', ensureAuthenticated, (req, res) => {
    res.render('admin/videos/form', {pageTitle: 'Add Video', messages: req.flash()})
  })

  router.post('/videos/new', ensureAuthenticated, (req, res) => {
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

  router.get('/videos/:slug/edit', ensureAuthenticated, (req, res) => {
    Video.find({slug: req.params.slug}).then((video) => {
      if (!video) {
        req.flash('error', 'No video found.');
        res.redirect('/admin/videos');
      } else {
        res.render('admin/videos/form', {video, pageTitle: 'Edit Video'});
      }
    }, (e) => {
      res.status(400).send(e);
    })
  })

  // router.post('/videos/:id/edit', ensureAuthenticated, (req, res) => {
  //   var id = req.params.id;
  //   Video.findById(id).then((video) => {
  //     if (!video) {
  //       req.flash('error', 'No video found.');
  //       res.redirect('/admin/videos');
  //     } else {
  //
  //       Video.update({ _id: id}, {})
  //     }
  //   })
  // })

  router.get('/suggestions', ensureAuthenticated, (req, res) => {
    SuggestedVideo.find({}).then((suggestedVideos) => {
      res.render('admin/suggest/index', {suggestedVideos, pageTitle: 'All Suggested Videos'})
    }, (e) => {
      res.status(400).send(e);
    })
  })

  router.get('/tags', ensureAuthenticated, (req, res) => {
    Tag.find().sort('title').then((tags) => {
      res.render('admin/tags/index', {tags, pageTitle: 'All Tags', messages: req.flash()})
    }, (e) => {
      res.status(400).send(e);
    })
  })

  router.get('/tags/new', ensureAuthenticated, (req, res) => {
    res.render('admin/tags/new', {pageTitle: 'Add Tag', messages: req.flash()})
  })

  router.post('/tags/new', ensureAuthenticated, (req, res) => {
    var title = req.body.title;
    var newSlug = slug(title).toLowerCase();
    Tag.findOne({'slug': slug}).then((tag) => {
      if (tag) {
        req.flash('error', 'Tag with that name already exists.');
        res.redirect('/admin/tags/new');
      } else {
        var newTag = new Tag({title, slug: newSlug});
        newTag.save().then((savedTag) => {
          req.flash('success', 'Tag saved');
          res.redirect('/admin/tags');
        }, (e) => {
          res.status(400).send(e);
        })
      }
    })
  })

  router.get('/tags/:slug/edit', ensureAuthenticated, (req, res) => {
    Tag.findOne({'slug': req.params.slug}).then((tag) => {
      res.render('admin/tags/edit', {tag, pageTitle: 'All Tags', messages: req.flash()})
    }, (e) => {
      res.status(400).send(e);
    })
  })

  router.post('/tags/:slug/edit', ensureAuthenticated, (req, res) => {
    var existingParams = {'slug': req.params.slug};
    Tag.findOne(existingParams).then((tag) => {
      if (!tag) {
        req.flash('error', 'No tag found');
        res.redirect('/admin/tags');
      } else {
        var newSlug = slug(req.body.title).toLowerCase();
        Tag.findOne({'slug': newSlug}).then((tag) => {
          if (tag) {
            req.flash('error', 'Tag with that name already exists');
            res.redirect(`/admin/tags/${req.params.slug}/edit`);
          } else {
            Tag.findOneAndUpdate({'slug': req.params.slug}, {title: req.body.title, slug: newSlug}).then((tag) => {
              req.flash('success', 'Tag updated');
              res.redirect('/admin/tags');
            }, (e) => {
              res.status(400).send(e);
            })
          }
        })
      }
    })
  })

  router.get('/tags/:slug/delete', ensureAuthenticated, (req, res) => {
    var existingParams = {'slug': req.params.slug};
    Tag.findOne(existingParams).then((tag) => {
      if (!tag) {
        req.flash('error', 'No tag found');
        res.redirect('/admin/tags');
      } else {
        Tag.remove(existingParams).then((tag) => {
          req.flash('success', 'Tag deleted');
          res.redirect('/admin/tags');
        }, (e) => {
          res.status(400).send(e);
        })
      }
    }, (e) => {
      res.status(400).end(e);
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
