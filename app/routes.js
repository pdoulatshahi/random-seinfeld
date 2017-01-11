const fs = require('fs');
const jsonfile = require('jsonfile');
const _ = require('lodash');

module.exports = (app) => {

  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/randomEpisode', (req, res) => {
    var episodes = JSON.parse(fs.readFileSync('episodes.json', 'utf8'));
    var seasons = req.param('s').map((num) => {
      return parseInt(num)
    });
    if (seasons) {
      episodes = episodes.filter((episode) => {
        return _.includes(seasons, episode.seasonNumber);
      })
    }
    var episodeInfo = episodes[Math.floor(Math.random() * episodes.length)]
    res.render('random_episode', {episodeInfo})
  })

};
