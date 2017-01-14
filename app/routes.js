const {mongoose} = require('./db/mongoose');
const {Episode} = require('./models/episode');

const seasonArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

module.exports = (app) => {

  app.get('/', function(req, res) {
    res.render('index', {seasonArray});
  });

  app.get('/randomEpisode', (req, res) => {
    var seasons = req.query.s;
    var seasonOptions = {};
    if (seasons) {
      seasons = seasons.map((num) => parseInt(num));
      seasonOptions = {"season": {"$in": seasons}}
    }
    Episode.find(seasonOptions).then((episodes) => {
      if (!episodes) {
        return res.status(404).send();
      }
      var random = Math.floor(Math.random() * episodes.length);
      var episode = episodes[random];
      var varsObj = {
        episode,
        seasonArray,
        seasons: seasons ? seasons : null
      }
      res.render('random_episode', varsObj);
    }).catch((e) => {
      res.status(400).send();
    })
  })

};
