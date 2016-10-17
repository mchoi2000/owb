'use strict';

describe('Loading Indicator Directive', function() {
  var scope, element, $httpBackend;

  beforeEach(module('common.loading'));

  beforeEach(
    inject(function($compile, $rootScope, _$httpBackend_) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope;
      element = angular.element('<div><loading-indicator></loading-indicator></div>');
      $compile(element)(scope);
      $httpBackend.expectGET('components/app/loading/loadingIndicator.html')
        .respond(200, '<html>Loading Indicator</html>');
      scope.$apply();
      $httpBackend.flush();
    })
  );

  it('should create a Loading Indicator Directive (Angular Route Defined)', function() {
    scope.loadingPage = true;
    scope.$broadcast('$routeChangeSuccess', {});
    expect(scope.loadingPage).toBeFalsy();
  });
});
