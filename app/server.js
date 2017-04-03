require ('newrelic');
require('./config/config');

const express = require('express');
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
  partialsDir: publicPath + '/views/partials',
  helpers: {
    ifIn: function (elem, list, options) {
      if (list.indexOf(parseInt(elem)) > -1) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
}))

app.set('view engine', '.hbs')
app.set('views', publicPath + '/views');

const rootRoutes = require('./routes/root');
app.use('/', rootRoutes);

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

app.listen(process.env.PORT);
