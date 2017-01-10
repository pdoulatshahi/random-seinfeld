const request = require('request');
const guidebox = require('guidebox');
const open = require('open');

const GUIDEBOX_KEY = require('./../app/guidebox');

const Guidebox = new guidebox(GUIDEBOX_KEY);
// 
// var seinfeldId;
// var seinfeldEpisodes;

// Guidebox.search.shows({field: 'title', query: 'Seinfeld'}).then((response) => {
//   return response.results[0].id;
// }).then(function(seinfeldId){
//   Guidebox.shows.episodes(seinfeldId).then((response) => {
//     seinfeldEpisodes = response;
//   })
// })

Guidebox.shows.episodes(2360, { include_links: true }).then((response) => {
  var resultsArray = response.results;
  var randomEpisode = resultsArray[Math.floor(Math.random() * resultsArray.length)];
  open(randomEpisode.subscription_web_sources[0].link)
})
