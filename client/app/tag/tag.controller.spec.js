'use strict';

describe('Controller: TagCtrl', function () {

  // load the controller's module
  beforeEach(module('moggerUiApp'));

  var TagCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TagCtrl = $controller('TagCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
