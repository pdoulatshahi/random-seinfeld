const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var QuoteSchema = new Schema({
  text: {
    type: String
  },
  _episode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Episode'
  },
})

var Quote = mongoose.model('Quote', QuoteSchema)

module.exports = {Quote}
