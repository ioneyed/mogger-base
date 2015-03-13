'use strict';

angular.module('moggerUiApp')
  .controller('PostCtrl', function ($scope, Post) {
    $scope.message = 'Hello';

    $scope.post = {
      title:'Tst Title',
      content:'Tst Content',
      slug: 'Tst Slug',
    }

    $scope.update = function(post){
      console.log(post);
      Post.save(post);
    }
  });
