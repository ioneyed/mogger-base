'use strict';

angular.module('moggerUiApp')
  .controller('CommentCtrl', function ($scope, Comment) {
    $scope.comment = {}

    $scope.create = function(comment){
      var res = new Comment(comment);
      res.$save().then(function(res){$scope.saved = "Saved"; console.log(res);})
                 .catch(function(req){$scope.saved = "Already exists"; console.log(req)})
    }

    //destroy function
    $scope.destroy = function(comment) {
      var res = new Comment(comment);
      res.$remove().then(function(res){$scope.deleted = "Deleted"; console.log(res);})
                 .catch(function(req){$scope.deleted = "Unable to delete comment"; console.log(req)})
    }

    //update function
    $scope.update = function(comment) {
      var res = new Comment(comment);
      res.$update().then(function(res){$scope.updated = "Updated Comment"; console.log(res);})
                 .catch(function(req){$scope.updated = "Unable to update comment"; console.log(req)})
    }
  });
