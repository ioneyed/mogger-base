var fs      = require('fs'),
  path      = require('path'),
  Sequelize = require('sequelize'),
  lodash    = require('lodash'),
  config = require('../config/environment');

  sequelize = new Sequelize(config.db.database, config.db.user, config.db.password,{
    host: config.db.host,
    dialect: 'postgres',
    pool: { maxConnections: 5, maxIdleTime: 30},
    define:{
      underscored:true
    }
  }),
  moment    = require('moment'),
  db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.indexOf('pg')!==-1);
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

// Synchronizing any model changes with database.
// WARNING: this will DROP your database everytime you re-run your application
/*sequelize
  .sync({force: true})
  .complete(function(err){
    if(err) console.log("An error occured %j",err);
    else console.log("Database dropped and synchronized");
});*/
sequelize
  .sync({force: true})
  .complete(function(err){
    var tags = [{
      typeValue: "HTML"
    },{
      typeValue: "CSS"
    },{
      typeValue: "JS"
    }];

    var categories = [{
      typeValue: "nodeJS"
    },{
      typeValue: "CXX"
    },{
      typeValue: "Ruby"
    }];

    var users = [{
      name: "John Smith",
      email: "js@email.com",
    },{
      name: "Sam Smith",
      email: "js1@email.com",
    },{
      name: "Dan Smith",
      email: "js2@email.com",
    }]

    var posts = [{
      title: "Title of the post 1",
      content: "Blah BlahBlah BlahBlah BlahBlah BlahBlah Blah Blah Blah Blah Blah Blah BlahBlah BlahBlah Blah Blah BlahBlah BlahBlah Blah",
      user_id: 1,
      category_id: 2
    },{
      title: "Title of the post 3",
      content: "Blah Blah Blah Blah Blah BlahBlah Blah Blah BlahBlah BlahBlah BlahBlah Blah",
      user_id: 2,
      category_id: 1
    },{
      title: "Title of the post 2",
      content: "Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah ",
      user_id: 3,
      category_id: 3
    }];

    var comments = [{
      content: "comment 1",
      user_id: 1,
      post_id: 1,
      parent_id: null
    },{
      content: "commet 2",
      user_id: 3,
      post_id: 1,
      parent_id: null
    },{
      content: "Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah ",
      user_id: 2,
      post_id: 1,
      parent_id: 1
    }];


  //   for(var i=0; i<tags.length; i++) {
  //     if(i+1!=tags.length){
  //       db.Tag.build(tags[i])
  //       .save()
  //     }else{
  //       db.Tag.build(tags[i])
  //       .save()
  //       .on("success", function(){
  //         for(var j=0; j<categories.length; j++) {
  //           if(j+1!=categories.length){
  //             db.Category
  //               .build(categories[j])
  //               .save();
  //           }else{
  //             db.Category
  //               .build(categories[j])
  //               .save()
  //               .on("success", function(){
  //                 for(var k=0; k<users.length; k++) {
  //                   var u = db.User.build(users[k]);
  //                   var usalt = u.makeSalt();
  //                   u.guid = u.encrypt(u.email,usalt);
  //                   u.hashedPassword= u.encryptPassword("password",usalt);
  //                   u.salt=usalt;
  //                   if(k+1!=users.length){
  //                     u.save()
  //                   }else{
  //                     u.save().on("success", function() {
  //                       if(k==users.length){
  //                         for(var l=0; l<posts.length; l++) {
  //                           db.Post.build(posts[l])
  //                             .save()
  //                             .on('success',function(post){
  //                               post.setTags([Math.floor(1+Math.random()*3)]);
  //                               if(post.id+1==posts.length){
  //                                 for(var m=0;m<comments.length;m++){
  //                                   if(m+1!=comments.length){
  //                                     db.Comment.build(comments[m]).save();
  //                                   }else{
  //                                     db.Comment.build(comments[m]).save();
  //                                   }
  //                                 }
  //                               }

  //                             });
  //                         }
  //                       }
  //                     });
  //                   }
  //                 }
  //               });
  //           }
  //         }
  //       });
  //   }
  // }


  //   if(err) console.log("An error occured %j",err);
  //   else console.log("Database dropped and synchronized");
});

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);
