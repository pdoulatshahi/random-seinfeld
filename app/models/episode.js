const mongoose = require('mongoose');

var Episode = mongoose.model('Episode', {
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
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
    unique: true,
    required: true
  },
  firstAired: {
    type: String,
    required: true
  },
  imdbId: {
    type: String,
    unique: true
  },
  imdbRating: {
    type: Number,
  },
  thumbnail: {
    type: String,
    unique: true,
    required: true
  },
  image: {
    type: String,
    unique: true,
    required: true
  },
  webLink: {
    type: String,
    unique: true,
    required: true
  },
  mobileLink: {
    type: String,
    unique: true,
    required: true
  },
  writers: [{
    type: String
  }],
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }]
});

module.exports = {Episode}
