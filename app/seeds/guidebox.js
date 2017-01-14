const GUIDEBOX_KEY = 'd80667547535889b4a9c68f606d30e7b84cc974f';

const guidebox = require('guidebox');
const moment = require('moment');
const jsonfile = require('jsonfile');
const Guidebox = new guidebox(GUIDEBOX_KEY);

Guidebox.shows.episodes(2360, {include_links: true, limit: 180}).then((response) => {
  var allEpisodes = [];
  response.results.forEach((episode) => {
    if (episode.subscription_web_sources.length > 0) {
      newEpisode = {
        title: episode.title,
        season: episode.season_number,
        episode: episode.episode_number,
        firstAired: moment(episode.first_aired, "YYYY-MM-DD").format("MMMM D, YYYY"),
        imdbId: episode.imdb_id,
        thumbnail: episode.thumbnail_208x117,
        image: episode.thumbnail_608x342,
        webLink: episode.subscription_web_sources[0].link,
        mobileLink: episode.subscription_ios_sources[0].link
      }
      allEpisodes.push(newEpisode);
    }
  })
  jsonfile.writeFile('app/seeds/episodes.json', allEpisodes)
})
