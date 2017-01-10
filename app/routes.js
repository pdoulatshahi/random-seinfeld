const fs = require('fs');
const jsonfile = require('jsonfile');

module.exports = (app) => {

  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/randomEpisode', (req, res) => {
    var episodes = JSON.parse(fs.readFileSync('episodes.json', 'utf8'));
    var season = req.param('season');
    if (season) {
      episodes = episodes.filter((episode) => {
        return episode.seasonNumber === parseInt(season);
      })
    }
    var episodeInfo = episodes[Math.floor(Math.random() * episodes.length)]
    res.render('random_episode', {episodeInfo})
  })

};
