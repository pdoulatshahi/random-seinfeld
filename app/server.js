require ('newrelic');
require('./config/config');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();

const publicPath = path.join(__dirname, '../public');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicPath));

app.use(session({ secret: 'secret-thing' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.seasonArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

require('./config/passport')(passport);

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

const homeRoutes = require('./routes/home');
app.use('/', homeRoutes);

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes(passport));

const suggestRoutes = require('./routes/suggest');
app.use('/suggest-video', suggestRoutes);

app.use((req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.render('errors/404-500',
    {
      pageTitle: 'Page Not Found',
      explainerText: 'That page cannot be found.'});
    return;
  }
  if (req.accepts('json')) {
    res.send({error: 'Not found'});
    return;
  }
});

app.use((req, res) => {
  res.status(500);
  if (req.accepts('html')) {
    res.render('errors/404-500',
    {
      pageTitle: 'Internal Server Error',
      explainerText: 'Sorry, there was an internal error.'});
    return;
  }
  if (req.accepts('json')) {
    res.send({error: 'Internal server error'});
    return;
  }
});

app.listen(process.env.PORT);
