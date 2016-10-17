'use strict';

describe('Review Image Directive', function() {
  var $compile;
  var $rootScope;

  beforeEach(module('common.review',
                    'common/app/review/image.html',
                    'common/app/review/group.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should provide href', function() {
    var scope = $rootScope.$new();
    scope.testVal = 'testValue';
    scope.testHref = 'http://test.com';
    var element = angular.element('<pwb-review-image label="testLabel" value="testVal"' +
                                  ' href="testHref"></pwb-review-image>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.isolateScope();
    expect(dirScope.label).toEqual('testLabel');
    expect(dirScope.value).toEqual('testValue');
    expect(dirScope.href).toEqual('http://test.com');
  });

  it('should provide value as href', function() {
    var scope = $rootScope.$new();
    scope.testVal = 'http://test.com';
    var element = angular.element('<pwb-review-group label="groupLabel">' +
                                    '<pwb-review-image label="testLabel" group-label' +
                                  ' value="testVal"></pwb-review-image></pwb-review-group>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.find('pwb-review-image').isolateScope();
    expect(dirScope.label).toEqual('testLabel');
    expect(dirScope.groupLabel).toEqual('groupLabel');
    expect(dirScope.value).toEqual('http://test.com');
    expect(dirScope.href).toEqual('http://test.com');
  });

  it('should watch value', function() {
    var scope = $rootScope.$new();
    scope.testVal = null;
    var element = angular.element('<pwb-review-image label="testLabel" value="testVal"' +
                                  '></pwb-review-image>');

    $compile(element)(scope);
    scope.$digest();
    scope.testVal = 'http://test.com';
    scope.$digest();

    var dirScope = element.isolateScope();
    expect(dirScope.label).toEqual('testLabel');
    expect(dirScope.value).toEqual('http://test.com');
    expect(dirScope.href).toEqual('http://test.com');
  });
});
