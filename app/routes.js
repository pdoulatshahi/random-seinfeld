const fs = require('fs');
const jsonfile = require('jsonfile');
const _ = require('lodash');

module.exports = (app) => {

  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/randomEpisode', (req, res) => {
    var seasons = req.param('s');
    var episodes = JSON.parse(fs.readFileSync('episodes.json', 'utf8'));
    if (seasons) {
      seasons = seasons.map((num) => {
        return parseInt(num)
      });
      episodes = episodes.filter((episode) => {
        return _.includes(seasons, episode.seasonNumber);
      });
    }
    var episodeInfo = episodes[Math.floor(Math.random() * episodes.length)]
    res.render('random_episode', {episodeInfo})
  })

};
