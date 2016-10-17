'use strict';

describe('Checkbox Component', function() {
  var $compile;
  var $rootScope;
  var $componentController;

  beforeEach(angular.mock.module('common.input', 'common/app/input/checkbox.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$componentController_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $componentController = _$componentController_;
  }));

  it('should compile', function(done) {
    var scope = $rootScope.$new();
    scope.testList = [{
      display: 'Option 1', value: 'option1', checked: false
    }, {
      display: 'Option 2', value: 'option2', checked: false
    }];
    scope.testModel = ['option1'];
    scope.mod = ['option1'];
    scope.changeOutput = function() {
      done();
    };
    var element = angular.element('<form name="testForm"><pwb-checkbox-input ' +
                                    'label="testLabel" ' +
                                    'description="testDesc"' +
                                    'input-id="testId" ' +
                                    'input-name="formName" ' +
                                    'model="testModel" ' +
                                    'list="testList" ' +
                                    'on-change="changeOutput()">' +
                                  '</pwb-checkbox-input></form>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.find('pwb-checkbox-input').isolateScope() as any;
    expect(dirScope.$ctrl.maxSelect).toEqual(3);
    expect(dirScope.$ctrl.minSelect).toEqual(0);
    expect(dirScope.$ctrl.list[0].checked).toEqual(true);

    dirScope.$ctrl.onChange();
  });

  it('should watch model', function() {
    var scope = $rootScope.$new();
    scope.testList = [{
      display: 'Option 1', value: 'option1', checked: false
    }, {
      display: 'Option 2', value: 'option2', checked: false
    }];
    scope.testModel = undefined;
    var element = angular.element('<form name="testForm"><pwb-checkbox-input ' +
                                    'label="testLabel" ' +
                                    'description="testDesc"' +
                                    'input-id="testId" ' +
                                    'input-name="formName" ' +
                                    'model="testModel" ' +
                                    'list="testList">' +
                                  '</pwb-checkbox-input></form>');

    $compile(element)(scope);
    scope.$digest();
    var dirScope = element.find('pwb-checkbox-input').isolateScope() as any;
    expect(dirScope.$ctrl.list[1].checked).toEqual(false);

    scope.testModel = ['option2'];
    scope.$digest();
    expect(dirScope.$ctrl.list[1].checked).toEqual(true);
  });

  it('should update model', function() {
    var scope = $rootScope.$new();
    scope.testList = [{
      display: 'Option 1', value: 'option1', checked: false
    }, {
      display: 'Option 2', value: 'option2', checked: false
    }];
    scope.testModel = [];
    scope.changeOutput = function() {};
    var element = angular.element('<form name="testForm"><pwb-checkbox-input ' +
                                    'label="testLabel" ' +
                                    'description="testDesc"' +
                                    'input-id="testId" ' +
                                    'input-name="formName" ' +
                                    'max-select="2" ' +
                                    'min-select="0" ' +
                                    'on-change="changeOutput" ' +
                                    'model="testModel" ' +
                                    'list="testList">' +
                                  '</pwb-checkbox-input></form>');

    $compile(element)(scope);
    scope.$digest();
    var dirScope = element.find('pwb-checkbox-input').isolateScope() as any;
    expect(dirScope.$ctrl.list[0].checked).toEqual(false);

    dirScope.$ctrl.list[0].checked = true;
    dirScope.$ctrl.updateModel();
    scope.$digest();
    expect(scope.testModel[0]).toEqual('option1');
  });

  it('should validate min select to be successful', function() {
    var scope = $rootScope.$new();
    let testList = [{
      display: 'Option 1', value: 'option1', checked: false
    }, {
      display: 'Option 2', value: 'option2', checked: false
    }];
    let testModel = [];

     $componentController = $componentController('pwbCheckboxInput', {
         '$scope': scope
     }, {
         label: 'testLabel',
         description: 'testDesc',
         inputId: 'testId',
         inputName: 'formName',
         mod: testModel,
         model: testModel,
         list: testList,
         minSelect: 1,
         maxSelect: 3
     });

      $componentController.model = ['one'];
      scope.$digest();

      var changes = {
         mod: {
             currentValue: []
         }
      };

      $componentController.$onChanges(changes);

      expect($componentController.maxSelect).toEqual(3);
      expect($componentController.minSelect).toEqual(1);

      $componentController.$onChanges({});

  });

});
