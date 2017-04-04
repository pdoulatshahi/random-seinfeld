const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');
const {Video} = require('./../models/video');


const express = require('express');
var router = express.Router();

const seasonArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

router.get('/', function(req, res) {
  res.render('index');
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

router.get('/randomEpisode', (req, res) => {
  var seasons = req.query.s;
  var seasonOptions = {};
  if (seasons) {
    seasons = seasons.map((num) => parseInt(num));
    seasonOptions = {"season": {"$in": seasons}}
  }
  Episode.find(seasonOptions).then((episodes) => {
    if (!episodes) {
      return res.status(404).send();
    }
    var random = Math.floor(Math.random() * episodes.length);
    var episode = episodes[random];
    var varsObj = {
      episode,
      seasonArray,
      seasons: seasons ? seasons : null
    }
    res.render('random_episode', varsObj);
  }).catch((e) => {
    res.status(400).send();
  })
});

router.get('/randomVideo', (req, res) => {
  Video.count().exec(function (err, count) {
    var random = Math.floor(Math.random() * count)
    Video.findOne().skip(random).populate('_episode').exec((err, video) => {
      console.log(video)
      res.render('random_video', {video})
    })
  })
})

module.exports = router;
