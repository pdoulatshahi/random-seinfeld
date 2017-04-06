const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('slug');

var TagSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
})

var Tag = mongoose.model('Tag', TagSchema)

module.exports = {Tag}
