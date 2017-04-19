const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
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
  }],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

VideoSchema.plugin(mongoosePaginate);

VideoSchema.pre('remove', function (next) {
  var video = this;
  video.model('Episode').update(
    {_id: video._episode},
    {$pull: {videos: video._id }},
    next
  );
  video.model('Tag').update(
    {_id: {$in: video.tags}},
    {$pull: {videos: video._id}},
    {multi: true},
    next
  );
});

var Video = mongoose.model('Video', VideoSchema)

module.exports = {Video}
