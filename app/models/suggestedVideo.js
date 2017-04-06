const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SuggestedVideoSchema = new Schema({
  youTubeId: {
    type: String,
    required: true
  },
  details: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

var SuggestedVideo = mongoose.model('SuggestedVideo', SuggestedVideoSchema)

module.exports = {SuggestedVideo}
