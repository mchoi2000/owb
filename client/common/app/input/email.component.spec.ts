describe('Email Input Component', function() {
  var $compile;
  var $rootScope;

  beforeEach(angular.mock.module('common.input', 'common/app/input/email.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should compile', function() {
    var scope: any = $rootScope.$new();
    scope.testModel = 'test@value.com';
    var element = angular.element('<form name="testForm"><pwb-email-input ' +
                                    'label="testLabel" ' +
                                    'input-id="testId"' +
                                    'input-name="testName" ' +
                                    'model="testModel" ' +
                                    'description="test description"' +
                                    'placeholder="spookyText">' +
                                  '</pwb-email-input></form>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope: any = element.find('pwb-email-input').isolateScope();

    expect(dirScope.$ctrl.label).toEqual('testLabel');
    expect(dirScope.$ctrl.inputId).toEqual('testId');
    expect(dirScope.$ctrl.inputName).toEqual('testName');
    expect(dirScope.$ctrl.model).toEqual(scope.testModel);
    expect(dirScope.$ctrl.description).toEqual('test description');
    expect(dirScope.$ctrl.placeholder).toEqual('spookyText');
    expect(dirScope.$ctrl.formCtrl.$name).toEqual('testForm');
  });

  it('should enforce pattern', function() {
    var scope = $rootScope.$new();
    scope.testModel = 'onlyletters@email.com';
    var element = angular.element('<form name="testForm"><pwb-email-input ' +
                                'input-id="testId" ' +
                                'input-name="testName" ' +
                                'model="testModel">' +
                              '</pwb-email-input></form>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope: any = element.find('pwb-email-input').isolateScope();

    expect(dirScope.$ctrl.formCtrl.testName.$error.email).toBeUndefined();
    dirScope.$ctrl.formCtrl.testName.$setViewValue('!@#$%');
    scope.$digest();
    expect(dirScope.$ctrl.formCtrl.testName.$error.email).toEqual(true);
    dirScope.$ctrl.formCtrl.testName.$setViewValue('valid@email.com');
    scope.$digest();
    expect(dirScope.$ctrl.formCtrl.testName.$error.email).toBeUndefined();
  });

  it('should invoke change', function(done) {
    var scope = $rootScope.$new();
    scope.testModel = 'test@value.com';
    scope.changeFn = function() {
      done();
    };
    var element = angular.element('<form name="testForm"><pwb-email-input ' +
                                    'input-id="testId"' +
                                    'input-name="testName" ' +
                                    'model="testModel" ' +
                                    'on-change="changeFn(newValue)">' +
                                  '</pwb-email-input></form>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope = element.find('pwb-email-input').isolateScope() as any;
    dirScope.$ctrl.formCtrl.testName.$setViewValue('newValue');
    scope.$digest();
  });

  it('should be required', function() {
    var scope = $rootScope.$new();
    scope.testModel = 'test@value.com';
    var element = angular.element('<form name="testForm"><pwb-email-input ' +
                                    'input-id="testId"' +
                                    'input-name="testName" ' +
                                    'model="testModel" ' +
                                    'is-required="true">' +
                                  '</pwb-email-input></form>');

    $compile(element)(scope);
    scope.$digest();

    var dirScope: any = element.find('pwb-email-input').isolateScope() as any;

    expect(dirScope.$ctrl.formCtrl.testName.$error.required).toBeUndefined();
    dirScope.$ctrl.formCtrl.testName.$setViewValue('');
    scope.$digest();
    expect(dirScope.$ctrl.formCtrl.testName.$error.required).toEqual(true);
    dirScope.$ctrl.formCtrl.testName.$setViewValue('valid');
    scope.$digest();
    expect(dirScope.$ctrl.formCtrl.testName.$error.required).toBeUndefined();
  });
});
