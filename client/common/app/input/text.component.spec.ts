'use strict';

describe('Text Input Component', function() {
  var $compile;
  var $rootScope;

  beforeEach(angular.mock.module('common.input', 'common/app/input/text.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should compile', function() {
    var scope = $rootScope.$new();
    scope.testModel = 'testValue';
    var element = angular.element('<form name="testForm"><pwb-text-input ' +
                                'label="testLabel" ' +
                                'input-id="testId"' +
                                'input-name="testName" ' +
                                'model="testModel" ' +
                                'description="test description"' +
                                'placeholder="spookyText">' +
                              '</pwb-text-input></form>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.find('pwb-text-input').isolateScope() as any;

    expect(dirScope.$ctrl.label).toEqual('testLabel');
    expect(dirScope.$ctrl.inputId).toEqual('testId');
    expect(dirScope.$ctrl.inputName).toEqual('testName');
    expect(dirScope.$ctrl.model).toEqual(scope.testModel);
    expect(dirScope.$ctrl.description).toEqual('test description');
    expect(dirScope.$ctrl.placeholder).toEqual('spookyText');
    expect(dirScope.$ctrl.formCtrl.$name).toEqual('testForm');
  });

  it('should enforce max length', function() {
    var scope = $rootScope.$new();
    scope.testModel = 'testVal';
    var element = angular.element('<form name="testForm"><pwb-text-input ' +
                                'input-id="testId"' +
                                'input-name="testName" ' +
                                'model="testModel" ' +
                                'max-length="8">' +
                              '</pwb-text-input></form>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.find('pwb-text-input').isolateScope() as any;

    expect(dirScope.$ctrl.formCtrl.testName.$error.maxlength).toBeUndefined();
    dirScope.$ctrl.formCtrl.testName.$setViewValue('valuetoolongnotvalid');
    scope.$digest();
    expect(dirScope.$ctrl.formCtrl.testName.$error.maxlength).toEqual(true);
    dirScope.$ctrl.formCtrl.testName.$setViewValue('valid');
    scope.$digest();
    expect(dirScope.$ctrl.formCtrl.testName.$error.maxlength).toBeUndefined();
  });

  it('should enforce min length', function() {
    var scope = $rootScope.$new();
    scope.testModel = 'validTestValue';
    var element = angular.element('<form name="testForm"><pwb-text-input ' +
                                'input-id="testId"' +
                                'input-name="testName" ' +
                                'model="testModel" ' +
                                'min-length="10">' +
                              '</pwb-text-input></form>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.find('pwb-text-input').isolateScope() as any;

    expect(dirScope.$ctrl.minLength).toEqual(10);
    expect(dirScope.$ctrl.formCtrl.testName.$error.minlength).toBeUndefined();
    dirScope.$ctrl.formCtrl.testName.$setViewValue('tooshort');
    scope.$digest();
    expect(dirScope.$ctrl.formCtrl.testName.$error.minlength).toEqual(true);
    dirScope.$ctrl.formCtrl.testName.$setViewValue('validlongenough');
    scope.$digest();
    expect(dirScope.$ctrl.formCtrl.testName.$error.minlength).toBeUndefined();
  });

  it('should enforce pattern', function() {
    var scope = $rootScope.$new();
    scope.testModel = 'onlyletters';
    var element = angular.element('<form name="testForm"><pwb-text-input ' +
                                'input-id="testId"' +
                                'input-name="testName" ' +
                                'model="testModel" ' +
                                'pattern="^\\w*$">' +
                              '</pwb-text-input></form>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.find('pwb-text-input').isolateScope() as any;

    expect(dirScope.$ctrl.formCtrl.testName.$error.pattern).toBeUndefined();
    dirScope.$ctrl.formCtrl.testName.$setViewValue('!@#$%');
    scope.$digest();
    expect(dirScope.$ctrl.formCtrl.testName.$error.pattern).toEqual(true);
    dirScope.$ctrl.formCtrl.testName.$setViewValue('valid');
    scope.$digest();
    expect(dirScope.$ctrl.formCtrl.testName.$error.pattern).toBeUndefined();
  });

  it('should invoke change', function(done) {
    var scope = $rootScope.$new();
    scope.testModel = 'onlyletters';
    scope.changeFn = function(value) {
      expect(value).toEqual('newValue');
      done();
    };
    var element = angular.element('<form name="testForm"><pwb-text-input ' +
                                'input-id="testId"' +
                                'input-name="testName" ' +
                                'model="testModel" ' +
                                'on-change="changeFn(newValue)">' +
                              '</pwb-text-input></form>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.find('pwb-text-input').isolateScope() as any;
    dirScope.$ctrl.formCtrl.testName.$setViewValue('newValue');
    scope.$digest();
  });

  it('should be deletable', function(done) {
    var scope = $rootScope.$new();
    scope.testModel = 'onlyletters';
    scope.deleteFn = function() {
      done();
    };
    var element = angular.element('<form name="testForm"><pwb-text-input ' +
                                'input-id="testId"' +
                                'input-name="testName" ' +
                                'model="testModel" ' +
                                'deletable="true"' +
                                'on-delete="deleteFn()">' +
                              '</pwb-text-input></form>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.find('pwb-text-input').isolateScope() as any;
    dirScope.$ctrl.onDelete();
  });

  it('should be required', function() {
    var scope = $rootScope.$new();
    scope.testModel = 'onlyletters';
    var element = angular.element('<form name="testForm"><pwb-text-input ' +
                                'input-id="testId"' +
                                'input-name="testName" ' +
                                'model="testModel" ' +
                                'is-required="true">' +
                              '</pwb-text-input></form>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.find('pwb-text-input').isolateScope() as any;

    expect(dirScope.$ctrl.formCtrl.testName.$error.required).toBeUndefined();
    dirScope.$ctrl.formCtrl.testName.$setViewValue('');
    scope.$digest();
    expect(dirScope.$ctrl.formCtrl.testName.$error.required).toEqual(true);
    dirScope.$ctrl.formCtrl.testName.$setViewValue('valid');
    scope.$digest();
    expect(dirScope.$ctrl.formCtrl.testName.$error.required).toBeUndefined();
  });
});
