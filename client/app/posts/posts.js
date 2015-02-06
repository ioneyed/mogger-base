'use strict';

angular.module('moggerUiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('posts', {
        url: '/posts',
        templateUrl: 'app/posts/posts.html',
        controller: 'PostsCtrl'
      });
  });