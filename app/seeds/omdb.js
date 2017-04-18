require('./../config/config');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://heroku_09swj8s4:6puc1s1ibi41v54lb90hq41r8s@ds111589.mlab.com:11589/heroku_09swj8s4');

const {Episode} = require('./../models/episode');

const omdb = require('omdb');
const imdb = require('imdb-api');
const _ = require('lodash');

// imdb.get('Seinfeld').then((things) => {
//   things.episodes().then((episodes) => {
//     episodes.forEach((episode) => {
//       var updateData = {imdbId: episode.imdbid};
//       Episode.findOneAndUpdate({'title': episode.name}, updateData, {new: true});
//     })
//   })
// })

Episode.find({}).then((episodes) => {
  episodes.forEach((episode) => {
    if (episode.imdbId.length > 0) {
      omdb.get({imdb: episode.imdbId}, (err, ep) => {
        var writers = _.uniq(ep.writers).sort();
        episode.writers = writers;
        episode.save();
      })
    }
  })
})
