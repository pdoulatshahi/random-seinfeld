require('./../config/config');

const request = require('request');
const cheerio = require('cheerio');
const striptags = require('striptags');

const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');
const {Quote} = require('./../models/quote');

Episode.findById("587a8617fb3cf21c53924057").then((episode) => {
  var imdbId = episode.imdbId;
  var url = `http://www.imdb.com/title/${imdbId}/trivia?tab=qt&ref_=tt_trv_qu`;
  request(url, (err, response, html) => {
    var $ = cheerio.load(html);
    var quoteElements = $(".sodatext");
    console.log(quoteElements.length);
    quoteElements.each(function(i, elem) {
      var thisQuote = $(this).html();
      var strippedQuote = striptags(thisQuote, '<span>');
      var quote = new Quote({
        text: strippedQuote,
        _episode: episode._id
      })
      quote.save().then((quote) => {
        episode.quotes.push(quote._id);
        episode.save();
      })
    })
  })
})

// Episode.find({}).then((episodes) => {
//   episodes.forEach((episode) => {
//     var imdbId = episode.imdbId;
//     if (imdbId.length > 0) {
//       var url = `http://www.imdb.com/title/${imdbId}/trivia?tab=qt&ref_=tt_trv_qu`;
//       request(url, (err, response, html) => {
//         var $ = cheerio.load(html);
//         $(".sodatext").each(function(i, elem) {
//           var thisQuote = $(this).html();
//           var strippedQuote = striptags(thisQuote, '<span>');
//           var quote = new Quote({
//             text: strippedQuote,
//             _episode: episode._id
//           })
//           quote.save().then((quote) => {
//             episode.quotes.push(quote._id);
//             episode.save();
//           })
//         })
//       })
//     }
//   })
// })
