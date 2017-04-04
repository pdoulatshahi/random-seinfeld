require('./../config/config');

const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');

const omdb = require('omdb');
const imdb = require('imdb-api');

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
        Episode.findOneAndUpdate({'imdbId': episode.imdbId}, ep.imdb.rating)
      })
    }
  })
})
