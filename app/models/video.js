const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var VideoSchema = new Schema({
  youTubeId: {
    type: String,
    required: true
  },
  _episode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Episode'
  }
})

var Video = mongoose.model('Video', VideoSchema)

module.exports = {Video}
