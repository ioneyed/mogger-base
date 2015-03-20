'use strict';

var _ = require('lodash');
// var Comment = require('./comment.model');
var pg = require('../../models')

// Get list of comments
exports.index = function(req, res) {
  pg.Comment.findAll(function (err, comments) {
    if(err) { return handleError(res, err); }
    return res.json(200, comments);
  });
};

// Get a single comment
exports.show = function(req, res) {
  pg.Comment.find(req.params.id).then(function (err, comment) {
    if(err) { return handleError(res, err); }
    if(!comment) { return res.send(404); }
    return res.json(comment);
  });
};

// Creates a new comment in the DB.
exports.create = function(req, res) {
  var incomingComment = pg.Comment.build(req.body);
  pg.Comment.find({where:{name:incomingComment.name}}).then(function(err,comment){
    if(err){return handleError(res,err)}
    if(!comment){
      incomingComment.save().then(function(comment){
        return res.json(201,comment)
      }).catch(function(err){
        return handleError(res,err)
      });
    }else{
      return res.json(201,comment);
    }
  });
};

// Updates an existing comment in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  pg.Comment.find(req.params.id).then(function (comment) {
    if(!comment) { return res.send(404); }
    var updated = _.merge(comment, req.body);
    updated.save().then(function (comment) {
      return res.json(200, comment);
    }).catch(function(err){
      return handleError(res, err);
    });
  }).catch(function(err){
    return handleError(res, err);
  });
};

// Deletes a comment from the DB.
exports.destroy = function(req, res) {
  pg.Comment.find(req.params.id).then(function (comment) {
    if(!comment) { return res.send(404); }
    comment.destroy().then(function() {
      return res.send(204);
    }).catch(function(err){
      return handleError(res, err);
    });
  }).catch(function(err){
    return handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
