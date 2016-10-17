'use strict';

describe('Radio Directive', function() {
  var compile, scope, element;

  beforeEach(angular.mock.module('common.input', 'common/app/input/radio.html'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    scope = $rootScope.$new();
    scope.testList = [{
      display: 'yes', value: true
    }, {
      display: 'no', value: false
    }];
    scope.testModel = 'testModel';
    element = angular.element('<form name="testForm"><pwb-radio-input ' +
                                'label="testLabel" ' +
                                'name="formName" ' +
                                'model="testModel" ' +
                                'choices="testList">' +
                              '</pwb-radio-input></form>');

    compile(element)(scope);
    scope.$digest();
  }));

  it('should compile', function() {});
});
