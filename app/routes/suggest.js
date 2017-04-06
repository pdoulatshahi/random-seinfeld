const {mongoose} = require('./../db/mongoose');
const {Video} = require('./../models/video');
const {SuggestedVideo} = require('./../models/suggestedVideo');

const getYouTubeId = require('get-youtube-id');

const express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('suggest/new');
});

router.post('/', (req, res) => {
  var youTubeId = getYouTubeId(req.body.youtube_url);
  if (!youTubeId) res.redirect('/suggest-video?yt=blank');
  Video.find({youTubeId: youTubeId}).then((videos) => {
    if (videos) res.redirect('/suggest-video?yt=duplicate');
    var suggestedVideo = new SuggestedVideo({
      youTubeId: youTubeId,
      details: req.body.details
    })
    suggestedVideo.save().then((newSuggestedVideo) => {
      res.redirect('/suggest-video/confirm')
    }, (e) => {
      res.status(400).send(e);
    })
  })

  router.get('/confirm', (req, res) => {
    res.render('/suggest/confirm')
  })

})

module.exports = router;
