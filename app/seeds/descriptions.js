require('./../config/config');

const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');

const request = require('request');

request('http://api.tvmaze.com/singlesearch/shows?q=seinfeld&embed=episodes', (e, response, body) => {
  var episodes = JSON.parse(body)._embedded.episodes;
  episodes.forEach((episode) => {
    var query = {season: episode["season"], episode: episode["number"]}
    var newData = {summary: episode["summary"]}
    Episode.findOneAndUpdate(query, newData)
  })
})
