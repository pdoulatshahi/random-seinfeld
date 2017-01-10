const express = require('express');
const request = require('request');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();

const publicPath = path.join(__dirname, '../public');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicPath));

app.engine('.hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir: publicPath + '/views/layouts',
  partialsDir: publicPath + '/views/partials'
}))

app.set('view engine', '.hbs')
app.set('views', publicPath + '/views');

require('./routes.js')(app);

app.listen(process.env.PORT || 3000);
