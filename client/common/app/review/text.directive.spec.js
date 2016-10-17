'use strict';

describe('Review Text Directive', function() {
  var $compile;
  var $rootScope;

  beforeEach(module('common.review',
                    'common/app/review/text.html',
                    'common/app/review/group.html'));

  beforeEach(inject(function($injector, _$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should compile', function() {
    var scope = $rootScope.$new();
    scope.value = 'testValue';
    var element = angular.element('<pwb-review-text label="testLabel" value="value">' +
                              '</pwb-review-text>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.isolateScope();
    expect(dirScope.label).toEqual('testLabel');
    expect(dirScope.value).toEqual('testValue');
  });

  it('should compile with group', function() {
    var scope = $rootScope.$new();
    scope.value = 'testValue';
    var element = angular.element('<pwb-review-group label="groupLabel">' +
                                    '<pwb-review-text label="testLabel" ' +
                                      ' value="value" group-label>' +
                                    '</pwb-review-text></pwb-review-group>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.find('pwb-review-text').isolateScope();
    expect(dirScope.label).toEqual('testLabel');
    expect(dirScope.value).toEqual('testValue');
    expect(dirScope.groupLabel).toEqual('groupLabel');
  });
});
