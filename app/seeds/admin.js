require('./../config/config');

const {mongoose} = require('./../db/mongoose');
const {Admin} = require('./../models/admin');

// create a user a new user
var testAdmin = new Admin({
    firstName: 'Paul',
    lastName: 'Doulatshahi',
    email: 'paul.doulatshahi@gmail.com',
    password: 'not-the-actual-one'
});

testAdmin.save().then((admin) => {
  console.log(admin);
})
