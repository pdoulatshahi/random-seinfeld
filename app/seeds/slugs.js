require('./../config/config');

const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');
const slug = require('slug');

Episode.find({}).then((episodes) => {
  episodes.forEach((episode) => {
    var episodeSlug = slug(episode.title).toLowerCase();
    episode.slug = episodeSlug;
    episode.save();
  })
})
