'use strict';

describe('Review Section Directive', function() {
  var compile, scope, element;

  beforeEach(module('common.review', 'common/app/review/section.html'));

  beforeEach(inject(function($injector, $compile, $rootScope) {
    compile = $compile;
    scope = $rootScope.$new();
    element = angular.element('<pwb-review-section name="testId" label="testLabel">' +
                              '</pwb-review-section>');

    compile(element)(scope);
    scope.$digest();
  }));

  it('should compile', function() {
    var dirScope = element.isolateScope();
    expect(dirScope.name).toEqual('testId');
    expect(dirScope.label).toEqual('testLabel');
  });
});
