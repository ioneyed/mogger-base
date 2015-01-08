'use strict';

module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define('Category', {
    typeValue: {
        type        : DataTypes.STRING,
        allowNull   : false
    }
  }, {
    tableName: 'categories',
    timestamps: true,
    paranoid: true,
    classMethods: {
        associate: function(models) {
            //  Category.hasMany(models.Post,{foreignKey:'postId'});
        }
    }
  });
 
  return Category;
};