'use strict';

angular.module('moggerUiApp')
  .controller('PostCtrl', function ($scope, Post) {
    $scope.message = 'Hello';

    $scope.post = {
      title:'Tst Title',
      content:'Tst Content',
      slug: 'Tst Slug',
    }

    $scope.create = function(post){
      var res = new Post(post);
      res.$save().then(function(res){$scope.saved = "Saved"; console.log(res);})
                 .catch(function(req){$scope.saved = req.data.slug+ " - Already exists"; console.log(req)})
    }

    //destroy function
    $scope.destroy = function(post) {
      var res = new Post(post);
      res.$remove().then(function(res){$scope.deleted = "Deleted"; console.log(res);})
                 .catch(function(req){$scope.deleted = req.data.slug+ " - Unable to delete post"; console.log(req)})
    }

    //update function
    $scope.update = function(post) {
      var res = new Post(post);
      res.$update().then(function(res){$scope.updated = "Updated Post"; console.log(res);})
                 .catch(function(req){$scope.updated = req.data.slug+ " - Unable to update post"; console.log(req)})
    }
  });
