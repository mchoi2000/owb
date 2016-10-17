'use strict';

describe('Dropdown Directive', function() {
  var compile, scope, element, controller;

  beforeEach(angular.mock.module('common.input', 'common/app/input/dropdown.html'));

  beforeEach(inject(function($compile, $rootScope, $componentController) {
    compile = $compile;
    controller = $componentController('pwbDropdownInput', null, null);
    scope = $rootScope.$new();
    scope.testList = [{
      display: 'yes', value: 'true'
    }, {
      display: 'no', value: 'false'
    }];
    scope.testModel = 'testModel';
    element = angular.element('<form name="testForm"><pwb-dropdown-input ' +
                                'label="testLabel" ' +
                                'description="testDesc" ' +
                                'input-id="testId" ' +
                                'input-name="formName" ' +
                                'model="testModel" ' +
                                'list="testList">' +
                              '</pwb-dropdown-input></form>');

    compile(element)(scope);
    scope.$digest();
  }));

  it('should compile', function() {
    var dirScope = element.find('pwb-dropdown-input').isolateScope() as any;
    controller.$onChanges({});
    expect(dirScope.$ctrl.display['true']).toEqual('yes');
    expect(dirScope.$ctrl.display['false']).toEqual('no');
  });
});
