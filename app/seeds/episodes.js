require('./../config/config');

const {mongoose} = require('./../db/mongoose');
const {Episode} = require('./../models/episode');
const fs = require('fs');

var episodes = JSON.parse(fs.readFileSync('app/seeds/episodes.json', 'utf8'));

episodes.forEach((episode) => {
  ep = new Episode(episode);
  ep.save().then((ep) => {
  }, (e) => {
  })
})
