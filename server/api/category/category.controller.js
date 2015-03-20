'use strict';

var _ = require('lodash');
// var Category = require('./category.model');
var pg = require('../../models')

// Get list of categories
exports.index = function(req, res) {
  pg.Category.findAll(function (err, categories) {
    if(err) { return handleError(res, err); }
    return res.json(200, categories);
  });
};

// Get a single category
exports.show = function(req, res) {
  pg.Category.find(req.params.id).then(function (err, category) {
    if(err) { return handleError(res, err); }
    if(!category) { return res.send(404); }
    return res.json(category);
  });
};

// Creates a new category in the DB.
exports.create = function(req, res) {
  var incomingCategory = pg.Category.build(req.body);
  pg.Category.find({where:{name:incomingCategory.name}}).then(function(err,category){
    if(err){return handleError(res,err)}
    if(!category){
      incomingCategory.save().then(function(category){
        return res.json(201,category)
      }).catch(function(err){
        return handleError(res,err)
      });
    }else{
      return res.json(201,category);
    }
  });
};

// Updates an existing category in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  pg.Category.find(req.params.id).then(function (category) {
    if(!category) { return res.send(404); }
    var updated = _.merge(category, req.body);
    updated.save().then(function (category) {
      return res.json(200, category);
    }).catch(function(err){
      return handleError(res, err);
    });
  }).catch(function(err){
    return handleError(res, err);
  });
};

// Deletes a category from the DB.
exports.destroy = function(req, res) {
  pg.Category.find(req.params.id).then(function (category) {
    if(!category) { return res.send(404); }
    category.destroy().then(function() {
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
