'use strict';
var crypto = require('crypto');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    guid: {
        type        : DataTypes.STRING,
        allowNull   : false,
    },
    name: {
        type        : DataTypes.STRING,
        allowNull   : true
    },
    email: {
        type        : DataTypes.STRING,
        allowNull   : true,
        unique      : true,
        get         : function(){
            if(this.getDataValue('email')){
                return this.getDataValue('email').toString().toLowerCase();
            }
        }
    },
    provider: {
        type        : DataTypes.STRING,
        allowNull   : false,
        defaultValue: 'local'
    },
    role: {
        type        : DataTypes.ENUM,
        values      : ['user','admin','moderator'],
        allowNull   : false,
        defaultValue: 'user'
    },
    hashedPassword  : DataTypes.STRING,
    salt            : DataTypes.STRING
    //rate,rating,forHire,displayName,tagline,bio,avatar
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    classMethods: {
        associate: function(models) {
            //User.hasMany(models.Comment,{foreignKey:'userId'});
            //User.hasMany(models.Post,{foreignKey:'userId'});
        }
    },
    instanceMethods:{
        makeSalt: function(){
            return crypto.randomBytes(16).toString('base64');
        },
        authenticate: function(pwPlain){
            return this.encryptPassword(pwPlain,this.salt)===this.hashedPassword;
        },
        encryptPassword: function(password,salt){
            if((!this.salt && !salt) && !password) return '';
            if(!this.salt && !salt){
                salt = new Buffer(this.makeSalt(),'base64');
            }else if(!salt){
                salt = new Buffer(this.salt,'base64');
            }else{
                salt = new Buffer(salt,'base64');
            }
            return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
        },
        encrypt: function(input,salt){
            if((!this.salt && !salt) && !input) return '';
            if(!this.salt && !salt){
                salt = new Buffer(this.makeSalt(),'base64');
            }else if(!salt){
                salt = new Buffer(this.salt,'base64');
            }else{
                salt = new Buffer(salt,'base64');
            }
            return crypto.pbkdf2Sync(input, salt, 10000, 64).toString('base64');
        },
        info: function(){
            return {
                id: this.id,
                displayName: this.displayName,
                email:this.email,
            };
        },
        profile: function(){
            return{
                _id: this.guid,
                name: this.name,
                guid: this.guid,
                role: this.role,
                provider: this.provider
            };
        },
    }
  });

  return User;
};
