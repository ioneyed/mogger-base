'use strict';

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    content: {
        type        : DataTypes.STRING,
        allowNull   : false
    }
  }, {
    tableName: 'posts',
    timestamps: true,
    paranoid: true,
    classMethods: {
        associate: function(models) {
            Post.belongsTo(models.User,{foreignKey:'user_id'});
            Post.belongsTo(models.Category, {foreignKey:'category_id'});
            Post.hasMany(models.Comment,{foreignKey:'post_id'});
            Post.hasMany(models.Tag, { through: models.PostTag });
        }
    }
  });
 
  return Post;
};