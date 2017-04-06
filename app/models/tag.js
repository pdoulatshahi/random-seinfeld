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

TagSchema.pre('validate', function(next) {
  console.log('running');
  var tag = this;
  tag.slug = slug(tag.title).toLowerCase();
  next();
});

var Tag = mongoose.model('Tag', TagSchema)

module.exports = {Tag}
