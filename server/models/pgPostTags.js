'use strict';

module.exports = function(sequelize, DataTypes) {
  var PostTag = sequelize.define('PostTag', {
  }, {
    tableName: 'post_tag',
    timestamps: true,
    paranoid: true,
    classMethods: {
        associate: function(models) {
          
        }
    }
  });
 
  return PostTag;
};
