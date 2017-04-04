const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');

const express = require('express');
var router = express.Router();

const seasonArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

router.get('/', function(req, res) {
  console.log(res);
  res.render('index');
});

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

module.exports = router;
