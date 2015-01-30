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
  User.find({'_id': {'$ne': req.user._id}}, '-salt -hashedPassword', function (err, users) {
    if(err || users){
      pg.User.findAll({
        where: 
          {'guid': {
            ne: req.user._id.toString()}
          }, 
        attributes: ['name', 'email', 'guid']
      })
        .then(function(pgUsers){
          pgUsers.forEach((function(pgUser){
            users.push(pgUser.dataValues);
          }))
          res.json(200, users);
        })
        .catch(function(err){
          return res.json(200, users);
          //use return below once no longer using dual database
          //return res.json(500, err);
        })
      }else if (err && !users) return res.send(500, err);
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
      var token = jwt.sign({_id: user.guid }, config.secrets.session, { expiresInMinutes: 60*5 });
      res.json({ token: token });
    })
    .catch(function(err){
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
          res.json(user.profile);
        })
        .catch(function(err){
          res.send(401);
        })
    } else if (err && !user) {
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
    if(err || !user) {
      pg.User.find({ where: {guid: req.params.id}})
        .then(function(user){
          user.destroy()
            .then(function(){
              res.send(204);
            })
            .catch(function(err){
              res.send(500,err);
            });
        })
        .catch(function(err){
          res.send(500, err);
        })
    } else if (err && !user) {
      res.send(500, err);
    }else{
      res.send(204);
    }
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
    if (err || !user) {
      pg.User.find({ where: 
        {guid: req.user.guid}, attributes: ['name', 'email', 'guid', 'role', 'provider']})
        .then(function(user) {
          if (!user){
             res.json(404);
          } else {
            res.json(200,user);
          }
        })
        .catch(function(err) {
          return next(err);   
        })
    }else if(user){
      res.json(200,user);
    }
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
