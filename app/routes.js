const fs = require('fs');
const jsonfile = require('jsonfile');
const _ = require('lodash');
const {mongoose} = require('./db/mongoose');
const {Episode} = require('./models/episode');

const seasonArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

module.exports = (app) => {

  app.get('/', function(req, res) {
    res.render('index', {seasonArray});
  });

  app.get('/randomEpisode', (req, res) => {
    var seasons = req.query.s;
    var episodes = JSON.parse(fs.readFileSync('episodes.json', 'utf8'));
    var episodeInfo = [];
    var variablesObj = {};
    if (seasons) {
      seasons = seasons.map((num) => {
        return parseInt(num)
      });
      episodes = episodes.filter((episode) => {
        return _.includes(seasons, episode.seasonNumber);
      });
      episodeInfo = episodes[Math.floor(Math.random() * episodes.length)];
      variablesObj = {episodeInfo, seasonArray, seasons}
    } else {
      episodeInfo = episodes[Math.floor(Math.random() * episodes.length)];
      variablesObj = {episodeInfo, seasonArray}
    }
    var episodeInfo =
    res.render('random_episode', variablesObj);
  })

};
