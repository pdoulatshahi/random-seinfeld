const mongoose = require('mongoose');

var Episode = mongoose.model('Episode', {
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  slug: {
    type: String,
    required: true
  },
  season: {
    type: Number,
    required: true,
  },
  episode: {
    type: Number,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  firstAired: {
    type: String,
    required: true
  },
  imdbId: {
    type: String,
  },
  imdbRating: {
    type: Number,
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
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }]
});

module.exports = {Episode}
