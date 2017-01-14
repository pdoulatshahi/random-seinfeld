const mongoose = require('mongoose');

var Episode = mongoose.model('Episode', {
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  season: {
    type: Number,
    required: true,
  },
  episode: {
    type: Number,
    required: true
  },
  firstAired: {
    type: Number,
    required: true
  },
  imdbId: {
    type: String,
  },
  thumbnail: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  webLink: {
    type: String,
    required: true
  },
  mobileLink: {
    type: String,
    required: true
  },
});

module.exports = {Episode}
