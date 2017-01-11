const GUIDEBOX_KEY = 'd80667547535889b4a9c68f606d30e7b84cc974f';

const request = require('request');
const guidebox = require('guidebox');
const moment = require('moment');
const jsonfile = require('jsonfile');
const Guidebox = new guidebox(GUIDEBOX_KEY);

Guidebox.shows.episodes(2360, {include_links: true, limit: 180}).then((response) => {
  var episodes = [];
  var arrOfEps = response.results;
  response.results.forEach((episode) => {
    if (episode.subscription_web_sources.length > 0) {
      episodes.push({
        title: episode.title,
        seasonNumber: episode.season_number,
        episodeNumber: episode.episode_number,
        firstAired: moment(episode.first_aired, "YYYY-MM-DD").format("MMM D, YYYY"),
        imdbId: episode.imdb_id,
        huluLink: episode.subscription_web_sources[0].link,
        thumbnail: episode.thumbnail_208x117,
        image: episode.thumbnail_608x342
      })
    }

  })
  jsonfile.writeFile('episodes.json', episodes)
  })
})
