'use strict';

describe('Input Error Directive', function() {
  var $compile;
  var $rootScope;

  beforeEach(angular.mock.module('common.input', 'common/app/input/error.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should compile', function() {
    var scope = $rootScope.$new();
    var element = angular.element('<pwb-input-error ' +
                                    'err-message="testMessage" ' +
                                    'show-err="true"> ' +
                                  '</pwb-input-error>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope: any = (element.isolateScope() as any);
    expect(dirScope.$ctrl.errMessage).toEqual('testMessage');
    expect(dirScope.$ctrl.showErr).toEqual(true);
  });
});
