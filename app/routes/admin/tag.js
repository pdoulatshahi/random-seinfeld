const {mongoose} = require('./../../db/mongoose');
const {Tag} = require('./../../models/tag');

const passport = require('./../../config/passport');

const getYouTubeId = require('get-youtube-id');
const slug = require('slug');

const express = require('express');
var router = express.Router();

module.exports = function(passport) {
  router.get('/', ensureAuthenticated, (req, res) => {
    Tag.find().sort('title').then((tags) => {
      res.render('admin/tags/index', {tags, pageTitle: 'All Tags'})
    }, (e) => {
      res.status(400).send(e);
    })
  })

  router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('admin/tags/new', {pageTitle: 'Add Tag'})
  })

  router.post('/new', ensureAuthenticated, (req, res) => {
    var title = req.body.title;
    var newSlug = slug(title).toLowerCase();
    Tag.findOne({'slug': newSlug}).then((tag) => {
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

  router.get('/:slug/edit', ensureAuthenticated, (req, res) => {
    Tag.findOne({'slug': req.params.slug}).then((tag) => {
      if (!tag) {
        req.flash('error', 'No tag found.');
        res.redirect('/admin/tags');
      }
      res.render('admin/tags/edit', {tag, pageTitle: 'All Tags'})
    }, (e) => {
      res.status(400).send(e);
    })
  })

  router.post('/:slug/edit', ensureAuthenticated, (req, res) => {
    var existingParams = {'slug': req.params.slug};
    Tag.findOne(existingParams).then((tag) => {
      if (!tag) {
        req.flash('error', 'No tag found');
        res.redirect('/admin/tags');
      } else {
        var newSlug = slug(req.body.title).toLowerCase();
        Tag.findOne({'slug': newSlug}).then((tag) => {
          if (tag && newSlug !== req.params.slug) {
            req.flash('error', 'Tag with that name already exists');
            res.redirect(`/admin/tags/${req.params.slug}/edit`);
          } else {
            Tag.findOneAndUpdate(existingParams, {title: req.body.title, slug: newSlug}).then((tag) => {
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

  router.get('/:slug/delete', ensureAuthenticated, (req, res) => {
    var existingParams = {'slug': req.params.slug};
    Tag.findOne(existingParams).then((tag) => {
      if (!tag) {
        req.flash('error', 'No tag found');
        res.redirect('/admin/tags');
      }
      tag.remove().then((tag) => {
        var title = tag.title;
        Video.update({}, {$pull: {tags: {title}}}, {multi: true}).then((videos) => {
          req.flash('success', 'Tag deleted');
          res.redirect('/admin/tags');
        })
      })
      }, (e) => {
        res.status(400).send(e);
      })
    }, (e) => {
      res.status(400).end(e);
    })
  // })

  return router;
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); }
  // denied. redirect to login
  res.redirect('/admin/login');
}
