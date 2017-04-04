const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {Admin} = require('./../models/admin');

module.exports = function(passport) {
  passport.serializeUser(function(admin, done) {
    done(null, admin.id);
  });
  passport.deserializeUser(function(id, done) {
    Admin.findById(id, function(err, admin) {
      done(err, admin);
    });
  });

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    Admin.findOne({'email':  email}, function(err, admin) {
      if (err) return done(err);
      if (!admin)
          return done(null, false, req.flash('loginMessage', 'No admin found with that e-mail address.'));
      if (!admin.comparePassword(password))
          return done(null, false, req.flash('loginMessage', 'Wrong password. Try again'));
      return done(null, admin);
    });
  }));
};
