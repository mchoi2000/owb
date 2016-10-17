'use strict';

describe('Review Group Directive', function() {
  var compile, scope, element;

  beforeEach(module('common.review', 'common/app/review/group.html'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    scope = $rootScope.$new();
    element = angular.element('<pwb-review-group label="testLabel">' +
                              '</pwb-review-group>');

    compile(element)(scope);
    scope.$digest();
  }));

  it('should compile', function() {
    var dirScope = element.isolateScope();
    expect(dirScope.label).toEqual('testLabel');
  });
});
