'use strict';

describe('Review List Directive', function() {
  var $compile;
  var $rootScope;

  beforeEach(module('common.review',
                    'common/app/review/list.html',
                    'common/app/review/group.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should compile', function() {
    var scope = $rootScope.$new();
    scope.list = ['testList'];
    var element = angular.element('<pwb-review-list label="testLabel" list="list">' +
                                  '</pwb-review-list>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.isolateScope();
    expect(dirScope.label).toEqual('testLabel');
    expect(dirScope.list.length).toEqual(1);
  });

  it('should compile with group', function() {
    var scope = $rootScope.$new();
    scope.list = ['testList'];
    var element = angular.element('<pwb-review-group label="groupLabel">' +
                                    '<pwb-review-list group-label label="testLabel" list="list">' +
                                    '</pwb-review-list></pwb-review-group>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.find('pwb-review-list').isolateScope();
    expect(dirScope.label).toEqual('testLabel');
    expect(dirScope.list.length).toEqual(1);
    expect(dirScope.groupLabel).toEqual('groupLabel');
  });
});
