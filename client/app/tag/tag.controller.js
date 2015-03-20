'use strict';

angular.module('moggerUiApp')
  .controller('TagCtrl', function ($scope, Tag) {
    $scope.tag = {}

    $scope.create = function(tag){
      var res = new Tag(tag);
      res.$save().then(function(res){$scope.saved = "Saved"; console.log(res);})
                 .catch(function(req){$scope.saved = "Already exists"; console.log(req)})
    }

    //destroy function
    $scope.destroy = function(tag) {
      var res = new Tag(tag);
      res.$remove().then(function(res){$scope.deleted = "Deleted"; console.log(res);})
                 .catch(function(req){$scope.deleted = "Unable to delete tag"; console.log(req)})
    }

    //update function
    $scope.update = function(tag) {
      var res = new Tag(tag);
      res.$update().then(function(res){$scope.updated = "Updated Tag"; console.log(res);})
                 .catch(function(req){$scope.updated = "Unable to update tag"; console.log(req)})
    }
  });
