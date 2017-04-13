const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var VideoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    lowercase: true,
    required: true
  },
  youTubeId: {
    type: String,
    unique: true,
    required: true
  },
  _episode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Episode'
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }]
})

var Video = mongoose.model('Video', VideoSchema)

module.exports = {Video}
