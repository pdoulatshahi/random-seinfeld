const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');
const {Video} = require('./../models/video');
const {SuggestedVideo} = require('./../models/suggestedVideo');
const {Tag} = require('./../models/tag');

const passport = require('./../config/passport');

const getYouTubeId = require('get-youtube-id');
const slug = require('slug');

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
    res.redirect('/admin/login')
  });

  router.get('/episodes', ensureAuthenticated, (req, res) => {
    Episode.find({}).then((episodes) => {
      res.render('admin/episodes/index', {episodes, pageTitle: 'All Episodes'})
    })
  })

  router.get('/episodes/:slug/edit', ensureAuthenticated, (req, res) => {
    Episode.findOne({'slug': req.params.slug}).then((episode) => {
      res.render('admin/episodes/edit', {episode, pageTitle: 'Edit Episode'})
    })
  })

  router.get('/videos', ensureAuthenticated, (req, res) => {
    Video.find({}).then((videos) => {
      res.render('admin/videos/index', {videos, pageTitle: 'All Videos'});
    })
  })

  router.get('/videos/new', ensureAuthenticated, (req, res) => {
    res.render('admin/videos/new', {pageTitle: 'Add Video'})
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

  router.get('/videos/:id/edit', ensureAuthenticated, (req, res) => {
    Video.findById(req.params.id).then((video) => {
      if (!video) {
        req.flash('error', 'No video found.');
        res.redirect('/admin/videos');
      } else {
        res.render('admin/videos/edit', {video, pageTitle: 'Edit Video'});
      }
    }, (e) => {
      res.status(400).send(e);
    })
  })

  router.get('/suggestions', ensureAuthenticated, (req, res) => {
    SuggestedVideo.find({}).then((suggestedVideos) => {
      res.render('admin/suggest/index', {suggestedVideos, pageTitle: 'All Suggested Videos'})
    }, (e) => {
      res.status(400).send(e);
    })
  })

  router.get('/tags', ensureAuthenticated, (req, res) => {
    Tag.find({}).then((tags) => {
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
    // req.user is available for use here
    return next(); }

  // denied. redirect to login
  res.redirect('/admin/login');
}
