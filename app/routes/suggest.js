const {mongoose} = require('./../db/mongoose');
const {Video} = require('./../models/video');
const {SuggestedVideo} = require('./../models/suggestedVideo');

const getYouTubeId = require('get-youtube-id');

const express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('suggest/new', {pageTitle: 'Suggest a Video'});
});

router.post('/', (req, res) => {
  var youTubeId = getYouTubeId(req.body.youtube_url);
  if (!youTubeId) {
    req.flash('error', 'No YouTube ID found.');
    res.redirect('/suggest-video');
  }
  Video.findOne({youTubeId}).then((video) => {
    console.log(video);
    if (video) {
      req.flash('error', 'That video is already in our database.');
      res.redirect('/suggest-video');
    }
    var suggestedVideo = new SuggestedVideo({
      youTubeId: youTubeId,
      title: req.body.title,
      details: req.body.details
    })
    suggestedVideo.save().then((newSuggestedVideo) => {
      req.flash('success', 'Video submitted.')
      res.redirect('/')
    }, (e) => {
      res.status(400).send(e);
    })
  })

  router.get('/confirm', (req, res) => {
    res.render('/suggest/confirm')
  })

})

module.exports = router;
