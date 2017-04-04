const {mongoose} = require('./../db/mongoose');
const {Admin} = require('./../models/admin');

// create a user a new user
var testAdmin = new Admin({
    firstName: 'Paul',
    lastName: 'Doulatshahi',
    email: 'paul.doulatshahi@gmail.com',
    password: 'douly.33'
});

// save user to database
testAdmin.save(function(err) {
    if (err) throw err;

    // fetch user and test password verification
  Admin.findOne({ email: 'paul.doulatshahi@gmail.com' }, function(err, user) {
      if (err) throw err;

      // test a matching password
      admin.comparePassword('douly.33', function(err, isMatch) {
          if (err) throw err;
          console.log('douly.33:', isMatch); // -&gt; Password123: true
      });

      // test a failing password
      user.comparePassword('derp', function(err, isMatch) {
          if (err) throw err;
          console.log('derp:', isMatch); // -&gt; 123Password: false
      });
    });
})
