'use strict';

describe('Subsection Directive', function() {
  var $compile;
  var $rootScope;

  beforeEach(angular.mock.module('common.input', 'common/app/input/subsection.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should compile', function() {
    var scope = $rootScope.$new();
    var element = angular.element('<pwb-input-subsection ' +
                                    'label="testLabel" ' +
                                    'description="testDesc">' +
                                  '</pwb-input-subsection>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.isolateScope() as any;
    expect(dirScope.$ctrl.label).toEqual('testLabel');
    expect(dirScope.$ctrl.description).toEqual('testDesc');
  });
});
