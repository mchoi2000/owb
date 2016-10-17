'use strict';

describe('Input Group Component', function() {
  var $compile;
  var $rootScope;

  beforeEach(angular.mock.module('common.input', 'common/app/input/group.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should compile', function() {
    var scope = $rootScope.$new();
    scope.testModel = ['item1'];
    scope.add = function() {};
    scope.delete = function() {};
    var element = angular.element('<pwb-input-group ' +
                                    'label="testLabel" ' +
                                    'subform-name="testName"' +
                                    'model="testModel" ' +
                                    'is-required="true" ' +
                                    'min-items="0" ' +
                                    'max-items="2" ' +
                                    'add-item="add" ' +
                                    'on-delete="delete">' +
                                  '</pwb-input-group>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.isolateScope() as any;
    expect(dirScope.$ctrl.label).toEqual('testLabel');
    expect(dirScope.$ctrl.subformName).toEqual('testName');
    expect(dirScope.$ctrl.isRequired).toEqual(true);
    expect(dirScope.$ctrl.minItems).toEqual(0);
    expect(dirScope.$ctrl.maxItems).toEqual(2);
  });
});
