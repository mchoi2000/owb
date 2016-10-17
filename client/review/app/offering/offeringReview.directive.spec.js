'use strict';

describe('Offering Review', function() {
  var compile, scope, element;

  beforeEach(module('review.offering', 'review/app/offering/offeringReview.html'));

  beforeEach(inject(function($injector, $compile, $rootScope) {
    compile = $compile;
    scope = $rootScope.$new();
    scope.testContent = {};
    element = angular.element('<pwb-offering-review content="testContent">' +
                              '</pwb-offering-review>');

    compile(element)(scope);
    scope.$digest();
  }));

  it('should compile', function() {
    var dirScope = element.isolateScope();
    expect(dirScope.content).toBeDefined();
  });
});
