const {mongoose} = require('./../db/mongoose');
const {Video} = require('./../models/video');
const {SuggestedVideo} = require('./../models/suggestedVideo');

const getYouTubeId = require('get-youtube-id');

const express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('suggest/new', {messages: req.flash(), pageTitle: 'Suggest a Video'});
});

router.post('/', (req, res) => {
  var youTubeId = getYouTubeId(req.body.youtube_url);
  if (!youTubeId) {
    req.flash('error', 'No YouTube ID found.');
    res.redirect('/suggest-video');
  }
  Video.find({youTubeId: youTubeId}).then((videos) => {
    if (videos) {
      req.flash('error', 'YouTube video already in database.');
      res.redirect('/suggest-video');
    }
    var suggestedVideo = new SuggestedVideo({
      youTubeId: youTubeId,
      details: req.body.details
    })
    suggestedVideo.save().then((newSuggestedVideo) => {
      res.redirect('/suggest-video/confirm', {pageTitle: 'Video Submitted'})
    }, (e) => {
      res.status(400).send(e);
    })
  })

  router.get('/confirm', (req, res) => {
    res.render('/suggest/confirm')
  })

})

module.exports = router;
