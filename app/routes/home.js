const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');
const {Video} = require('./../models/video');
const {Tag} = require('./../models/tag');

const express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('home/index', {pageTitle: 'The App About Nothing'});
});

router.get('/episodes/all', (req, res) => {
  Episode.find({}, 'title').then((episodes) => {
    if (!episodes) {
      return res.status(404).send();
    }
    var epJSON = {}
    episodes.forEach((ep) => {
      epJSON[ep.title] = null;
    })
    res.setHeader('Content-Type', 'application/json');
    res.json(JSON.stringify(epJSON, null, 2));
  })
})

router.get('/tags/all', (req, res) => {
  Tag.find({}, 'title').then((tags) => {
    if (!tags) {
      return res.status(404).send();
    }
    var tagJSON = {}
    tags.forEach((tag) => {
      tagJSON[tag.title] = null;
    })
    res.setHeader('Content-Type', 'application/json');
    res.json(JSON.stringify(tagJSON, null, 2));
  })
})

router.get('/random-episode', (req, res) => {
  var seasons = req.query.s;
  var seasonOptions = {};
  var seasonParams = '';
  if (seasons) {
    seasons = seasons.map((num) => parseInt(num));
    seasonOptions = {"season": {"$in": seasons}};
    seasonParams = '?s[]=' + seasons.join('&s[]=');
  }
  Episode.find(seasonOptions).then((episodes) => {
    if (!episodes) {
      return res.status(404).send();
    }
    var random = Math.floor(Math.random() * episodes.length);
    var episodeSlug = episodes[random].slug;
    res.redirect('/episode/' + episodeSlug + seasonParams);
  }).catch((e) => {
    res.status(400).send();
  })
});

router.get('/episode/:slug', (req, res) => {
  var seasons = req.query.s;
  if (seasons) {
    seasons = seasons.map((num) => parseInt(num));
  }
  Episode.findOne({'slug': req.params.slug}).then((episode) => {
    res.render('home/episode', {episode, seasons, pageTitle: episode.title})
  }).catch((e) => {
    res.status(400).send();
  })
})

router.get('/random-video', (req, res) => {
  Video.count().exec(function (err, count) {
    var random = Math.floor(Math.random() * count)
    Video.findOne().skip(random).populate('_episode tags').exec((err, video) => {
      res.render('home/random_video', {video, pageTitle: 'Random Seinfeld Clip'})
    })
  })
})

module.exports = router;