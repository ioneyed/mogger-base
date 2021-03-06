'use strict';

angular.module('moggerUiApp')
  .factory('Post', function ($resource) {
    return $resource('/api/posts/:id/:controller', {
      id: '@_id'
    },{
      update: {method:'PUT', params:{id:'@_id'}}}
    );
  });
