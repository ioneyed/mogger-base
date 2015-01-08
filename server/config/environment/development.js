'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo:{
    uri: 'mongodb://localhost/moggerui-dev',
  },
  db: {
    host: 'localhost',
    database: 'mogger',
    user: 'mogger',
    password: 'mogger'
  },

  seedDB: true
};
