'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
    var userId;
    if(user.hasOwnProperty('_id')){
    	userId = user._id
    }else{
    	userId= user.guid;
    }
    var token = auth.signToken((user.hasOwnProperty('_id') ? user._id: user.guid), user.role);
    res.json({token: token});
  })(req, res, next)
});

module.exports = router;