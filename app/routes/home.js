const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');
const {Quote} = require('./../models/quote');
const {Video} = require('./../models/video');
const {Tag} = require('./../models/tag');

const express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  Episode.count().exec((err, count) => {
    var random = Math.floor(Math.random() * count);
    Episode.findOne().skip(random).exec((err, episode) => {
      Video.count().exec((err, count) => {
        var random = Math.floor(Math.random() * count);
        Video.findOne().skip(random).exec((err, video) => {
          res.render('home/index', {episode, video, pageTitle: 'The App About Nothing'});
        }).catch((e) => {
          res.status(400).send(e);
        })
      }).catch((e) => {
        res.status(400).send(e);
      })
    }).catch((e) => {
      res.status(400).send(e);
    })
  }).catch((e) => {
    res.status(400).send(e);
  })

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
    if (episode.writers.length > 0) {
      episode.writers = episode.writers.join(', ');
    }
    var quoteIdArray = episode.quotes;
    if (quoteIdArray.length > 0) {
      var quoteId = quoteIdArray[Math.floor(Math.random() * quoteIdArray.length)];
      Quote.findById(quoteId).then((thisQuote) => {
        var quote = thisQuote.text;
        res.render('home/episode', {episode, quote, seasons, pageTitle: episode.title})
      })
    } else {
      res.render('home/episode', {episode, seasons, pageTitle: episode.title})
    }
  }).catch((e) => {
    res.status(400).send();
  })
})

router.get('/random-video', (req, res) => {
  var tag = req.query.tag;
  if (tag) {
    Tag.findOne({slug: tag}).populate('videos').then((tag) => {
      if (!tag) {
        req.flash('error', 'No video found');
        res.redirect('/');
      } else {
        var random = Math.floor(Math.random() * tag.videos.length);
        var videoSlug = tag.videos[random].slug;
        res.redirect('/video/' + videoSlug);
      }
    }).catch((e) => {
      res.status(400).send(e);
    })
  } else {
    Video.count().exec((err, count) => {
      var random = Math.floor(Math.random() * count);
      Video.findOne().skip(random).exec((err, video) => {
        res.redirect('/video/' + video.slug)
      }).catch((e) => {
        res.status(400).send(e);
      })
    }).catch((e) => {
      res.status(400).send(e);
    })
  }
})

router.get('/video/:slug', (req, res) => {
  Video.findOne({slug: req.params.slug}).populate('tags _episode').then((video) => {
    res.render('home/video', {video, pageTitle: 'Random Seinfeld Clip'})
  }).catch((e) => {
    res.status(400).send();
  })
})

module.exports = router;
