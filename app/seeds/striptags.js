require('./../config/config');

const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');
const striptags = require('striptags');

Episode.find({}).then((episodes) => {
  episodes.forEach((episode) => {
    episode.summary = striptags(episode.summary);
    episode.save();
  })
})
