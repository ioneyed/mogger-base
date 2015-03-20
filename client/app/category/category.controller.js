'use strict';

angular.module('moggerUiApp')
  .controller('CategoryCtrl', function ($scope, Category) {
    $scope.category = {}

    $scope.create = function(category){
      var res = new Category(category);
      res.$save().then(function(res){$scope.saved = "Saved"; console.log(res);})
                 .catch(function(req){$scope.saved = "Already exists"; console.log(req)})
    }

    //destroy function
    $scope.destroy = function(category) {
      var res = new Category(category);
      res.$remove().then(function(res){$scope.deleted = "Deleted"; console.log(res);})
                 .catch(function(req){$scope.deleted = "Unable to delete category"; console.log(req)})
    }

    //update function
    $scope.update = function(category) {
      var res = new Category(category);
      res.$update().then(function(res){$scope.updated = "Updated Category"; console.log(res);})
                 .catch(function(req){$scope.updated = "Unable to update category"; console.log(req)})
    }
  });
