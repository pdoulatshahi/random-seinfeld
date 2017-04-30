const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TagSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }]
})

var Tag = mongoose.model('Tag', TagSchema)

module.exports = {Tag}
