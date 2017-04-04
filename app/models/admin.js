const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var Admin = mongoose.model('Admin', {
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  }
});

Admin.schema.pre('save', function(next) {
  var admin = this;
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(admin.password, salt, function(err, hash) {
      if (err) return next(err);
      admin.password = hash;
      next();
    })
  })
});

Admin.schema.methods.comparePassword = function(password) {
  return bcrypt.compare(this.password, password)
};

module.exports = {Admin}
