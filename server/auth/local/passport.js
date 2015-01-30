var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var pg = require('../../models');

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      User.findOne({
        email: email.toLowerCase()
      }, function(err, user) {
        /*if (err) return done(err);

        if (!user) {
          return done(null, false, { message: 'This email is not registered.' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'This password is not correct.' });
        }
        return done(null, user);*/

        if (user) {
          if (!user.authenticate(password)) {
            return done(null, false, { message: 'This password is not correct.' }); 
          }
          return done(null, user);
        } else {
            pg.User.find({ where: {'email': email.toLowerCase()}})
            .then(function(pgUser){
              if (!pgUser.authenticate(password)) {
                return done(null, false, { message: 'This password is not correct.' });
              }
              return done(null, pgUser);
            })
            .catch(function(err){
               return done(null, false, { message: 'This email is not registered.' });
            }) 
        }
      });
    }
  ));
};