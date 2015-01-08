'use strict';

var User = require('./user.model');
var pg = require('../../models');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  var errs = {
    create: {
      data: 'Account could not be created, please contact the administrator.',
    }
  }
  console.log(err);
  if (errs.hasOwnProperty(err)){
    return res.json(422, errs[err]);
  }
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  // var newUser = new User(req.body);
  // newUser.provider = 'local';
  // newUser.role = 'user';
  // newUser.save(function(err, user) {
  //   if (err) return validationError(res, err);
  //   var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
  //   res.json({ token: token });
  // });
  var pgNewUser = pg.User.build(req.body);
  console.log("pre-save:",pgNewUser);
  pgNewUser.salt = pgNewUser.makeSalt();
  pgNewUser.hashedPassword = pgNewUser.encryptPassword(req.body.password,pgNewUser.salt);
  pgNewUser.guid = pgNewUser.encrypt(pgNewUser.email,pgNewUser.salt);
  pgNewUser.save()
    .then(function(user){
      console.log("user-save:",user);
      var token = jwt.sign({_id: user.guid }, config.secrets.session, { expiresInMinutes: 60*5 });
      res.json({ token: token });
    })
    .catch(function(err){
      console.log('user-catch:',err); 
      return validationError(res, 'create');
    })
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err || !user) {
      pg.User.find({ where: {guid: userId}})
        .then(function(user){
          console.log(user.profile);
          res.json(user.profile);
        })
        .catch(function(err){
          res.send(401);
        })
    } else if (err && user) {
      return next(err);
    }
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if (err || !user) {
      pg.User.find({ where: {guid: userId}})
        .then(function(user){
          if (user.authenticate(oldPass)) {
            user.hashedPassword = user.encrypt(newPass, user.salt);
            user.save()
              .then(function(){
                res.send(200);  
              })
              .catch(function(err){
                return validationError(res, err);
              })
          } else {
            res.send(403);
          }
        })
        .catch(function(err){
          return validationError(res, err);
        })
    } 
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });

};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
