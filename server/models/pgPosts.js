'use strict';

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    content: {
        type        : DataTypes.STRING,
        allowNull   : false
    },
    title: {
        type        : DataTypes.STRING,
        allowNull   : false
    },
    slug: {
        type        : DataTypes.STRING,
        allowNull   : false,
    }
  }, {
    tableName: 'posts',
    timestamps: true,
    paranoid: true,
    classMethods: {
        associate: function(models) {
            Post.belongsTo(models.User,{foreignKey:'user_id'});
            Post.belongsTo(models.Category, {foreignKey:'category_id'});
            Post.belongsToMany(models.Comment,{foreignKey:'post_id'});
            Post.belongsToMany(models.Tag, { through: models.PostTag });
        }
    },
    instanceMethods:{
      generateSlug: function(){
          this.slug = this.title.toString().toLowerCase()
            .replace(/\s+/g, '-')        // Replace spaces with -
            .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
            .replace(/\-\-+/g, '-')      // Replace multiple - with single -
            .replace(/^-+/, '')          // Trim - from start of text
            .replace(/-+$/, '');         // Trim - from end of text
          return this;
        }
    },

  });

  return Post;
};
