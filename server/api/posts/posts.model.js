'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostsSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Posts', PostsSchema);