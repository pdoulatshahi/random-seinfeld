const request = require('request');
const guidebox = require('guidebox');
const moment = require('moment');

const GUIDEBOX_KEY = require('./../app/guidebox');
const Guidebox = new guidebox(GUIDEBOX_KEY);

module.exports = (app) => {

  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/randomEpisode', (req, res) => {
    var season = req.param('season');
    if (season) {
      optionsObject = {include_links: true, season: parseInt(req.param('season'))}
    } else {
      optionsObject = {include_links: true}
    }
    Guidebox.shows.episodes(2360, optionsObject).then((response) => {
      var arrOfEps = response.results;
      var episode = arrOfEps[Math.floor(Math.random() * arrOfEps.length)];
      var episodeInfo = {
        title: episode.title,
        seasonNumber: episode.season_number,
        episodeNumber: episode.episode_number,
        firstAired: moment(episode.first_aired, "YYYY-MM-DD").format("MMM D, YYYY"),
        imdbId: episode.imdb_id,
        huluId: episode.subscription_web_sources[0].link.substr(episode.subscription_web_sources[0].link.lastIndexOf('/') + 1),
      }
      res.render('random_episode', {episodeInfo})
    })
  })

};
