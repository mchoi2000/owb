'use strict';

describe('Review Subsection Directive', function() {
  var compile, scope, element;

  beforeEach(module('common.review', 'common/app/review/subsection.html'));

  beforeEach(inject(function($injector, $compile, $rootScope) {
    compile = $compile;
    scope = $rootScope.$new();
    element = angular.element('<pwb-review-subsection label="testLabel"></pwb-review-subsection>');

    compile(element)(scope);
    scope.$digest();
  }));

  it('should compile', function() {
    var dirScope = element.isolateScope();
    expect(dirScope.label).toEqual('testLabel');
  });
});
