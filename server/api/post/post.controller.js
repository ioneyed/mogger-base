'use strict';

var _ = require('lodash');
// var Post = require('./post.model');
var pg = require('../../models')

// Get list of posts
exports.index = function(req, res) {
  pg.Post.findAll(function (err, posts) {
    if(err) { return handleError(res, err); }
    return res.json(200, posts);
  });
};

// Get a single post
exports.show = function(req, res) {
  pg.Post.find(req.params.id).then(function (err, post) {
    if(err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    return res.json(post);
  });
};

// Creates a new post in the DB.
exports.create = function(req, res) {
  var incomingPost = pg.Post.build(req.body).generateSlug();
  pg.Post.find({where:{slug:incomingPost.slug}}).then(function(err,post){
    if(err){return handleError(res,err)}
    if(!post){
      incomingPost.save().then(function(post){
        return res.json(201,post)
      }).catch(function(err){
        return handleError(res,err)
      });
    }else{
      return res.json(201,post);
    }
  });
};

// Updates an existing post in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  pg.Post.find(req.params.id).then(function (post) {
    if(!post) { return res.send(404); }
    var updated = _.merge(post, req.body);
    updated.save().then(function (post) {
      return res.json(200, post);
    }).catch(function(err){
      if (err) { return handleError(res, err); }
    });
  }).catch(function(err){
    if (err) { return handleError(res, err); }
  });
};

// Deletes a post from the DB.
exports.destroy = function(req, res) {
  pg.Post.find(req.params.id).then(function (post) {
    if(!post) { return res.send(404); }
    post.destroy().then(function() {
      return res.send(204);
    }).catch(function(err){
      if(err) { return handleError(res, err); }
    });
  }).catch(function(err){
    if(err) { return handleError(res, err); }
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
