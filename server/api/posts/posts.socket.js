/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Posts = require('./posts.model');

exports.register = function(socket) {
  Posts.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Posts.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('posts:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('posts:remove', doc);
}