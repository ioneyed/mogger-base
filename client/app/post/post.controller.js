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
      res.$save().then(function(res){ $scope.saved = "saved"; console(res);})
                 .catch(function(req){$scope.saved = req.data.slug+ " - Already Exists"; console.log(req)})
    }

    //TODO Create a Delete and an Update function similar to the $scope.create function
    //Display the error when it comes back, display that the event was successful.
    //Follow JKISS (Just Keep it Simple, Stupid).
    
  });
