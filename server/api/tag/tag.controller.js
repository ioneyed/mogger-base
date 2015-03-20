'use strict';

var _ = require('lodash');
// var Tag = require('./tag.model');
var pg = require('../../models')

// Get list of tags
exports.index = function(req, res) {
  pg.Tag.findAll(function (err, tags) {
    if(err) { return handleError(res, err); }
    return res.json(200, tags);
  });
};

// Get a single tag
exports.show = function(req, res) {
  pg.Tag.find(req.params.id).then(function (err, tag) {
    if(err) { return handleError(res, err); }
    if(!tag) { return res.send(404); }
    return res.json(tag);
  });
};

// Creates a new tag in the DB.
exports.create = function(req, res) {
  var incomingTag = pg.Tag.build(req.body);
  pg.Tag.find({where:{name:incomingTag.name}}).then(function(err,tag){
    if(err){return handleError(res,err)}
    if(!tag){
      incomingTag.save().then(function(tag){
        return res.json(201,tag)
      }).catch(function(err){
        return handleError(res,err)
      });
    }else{
      return res.json(201,tag);
    }
  });
};

// Updates an existing tag in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  pg.Tag.find(req.params.id).then(function (tag) {
    if(!tag) { return res.send(404); }
    var updated = _.merge(tag, req.body);
    updated.save().then(function (tag) {
      return res.json(200, tag);
    }).catch(function(err){
      return handleError(res, err);
    });
  }).catch(function(err){
    return handleError(res, err);
  });
};

// Deletes a tag from the DB.
exports.destroy = function(req, res) {
  pg.Tag.find(req.params.id).then(function (tag) {
    if(!tag) { return res.send(404); }
    tag.destroy().then(function() {
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
