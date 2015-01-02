'use strict';

module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    content: {
        type        : DataTypes.STRING,
        allowNull   : false
    }
  }, {
    tableName: 'comments',
    timestamps: true,
    paranoid: true,
    classMethods: {
        associate: function(models) {
            Comment.belongsTo(models.User,{foreignKey:'user_id'});
            Comment.belongsTo(models.Post,{foreignKey:'post_id'});
            Comment.hasOne(models.Comment,{foreignKey:'parent_id'});
        }
    }
  });
 
  return Comment;
};