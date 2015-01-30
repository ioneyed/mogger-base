'use strict';

module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define('Tag', {
    typeValue: {
      type : DataTypes.STRING,
      allowNull : false
    }
  }, {
    tableName: 'tags',
    timestamps: true,
    paranoid: true,
    classMethods: {
        associate: function(models) {
            Tag.belongsToMany(models.Post,{ through: models.PostTag });
        }
    }
  });
 
  return Tag;
};