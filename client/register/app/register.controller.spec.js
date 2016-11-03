'use strict';

describe('Register controller', function() {
  var $httpBackend;
  var $controller;

  beforeEach(module('register', function($provide) {
    $provide.value('$window', {
      location: {
        href: ''
      }
    });
  }));

  beforeEach(inject(function(_$httpBackend_, _$controller_) {
    $httpBackend = _$httpBackend_;
    $controller = _$controller_;
    $httpBackend.when('GET', 'api/locales').respond(['en-us']);
    $httpBackend.when('POST', 'auth/register/cmm').respond({});
    $httpBackend.when('GET', 'api/user').respond({_id: 'userId'});
  }));

  it('should get user', function() {
    var ctrl = $controller('RegistrationController');
    $httpBackend.expect('GET', 'api/user');
    ctrl.getUser();
    $httpBackend.flush();
    expect(ctrl.user._id).toBe('userId');
  });

  it('should get locales', function() {
    var ctrl = $controller('RegistrationController');
    $httpBackend.expect('GET', 'api/locales');
    ctrl.getLocales();
    $httpBackend.flush();
    expect(ctrl.locales[0]).toBe('en-us');
  });

  it('should accept registration', function() {
    var ctrl = $controller('RegistrationController');
    $httpBackend.expect('POST', 'auth/register/cmm');
    ctrl.role = 'test';
    ctrl.selectedLocales = ['en-us'];
    var projectRoleField = {};
    projectRoleField.$setViewValue = function(viewValue) {
      expect(viewValue).toBe('test');
    };

    var projectLocalesField = {};
    projectLocalesField.$setViewValue = function(viewValue) {
      expect(viewValue[0]).toBe('en-us');
    };
    ctrl.acceptRegistration({
      $invalid: false,
      projectRole: projectRoleField,
      projectLocales: projectLocalesField
    });

    $httpBackend.flush();
  });

  it('should accept registration (invalid form)', function() {
    var ctrl = $controller('RegistrationController');
    ctrl.role = 'test';
    ctrl.selectedLocales = ['en-us'];

    var projectRoleField = {};
    projectRoleField.$setViewValue = function(viewValue) {
      expect(viewValue).toBe('test');
    };

    var projectLocalesField = {};
    projectLocalesField.$setViewValue = function(viewValue) {
      expect(viewValue[0]).toBe('en-us');
    };

    ctrl.acceptRegistration({
      $invalid: true,
      projectRole: projectRoleField,
      projectLocales: projectLocalesField
    });
  });

  it('should update the role option', function() {
    var ctrl = $controller('RegistrationController');

    ctrl.updateRoleOption('test', true);
    expect(ctrl.role).toBe('test');

    ctrl.updateRoleOption('test', false);
    expect(ctrl.role).toBe('test');
  });

  it('should update the role option with other', function() {
    var ctrl = $controller('RegistrationController');

    ctrl.updateRoleOption('Other', true);
    expect(ctrl.role).toBe('');
    expect(ctrl.roleSelection).toBe('Other');
  });

  it('should initialize the registration', function() {
    var ctrl = $controller('RegistrationController');

    ctrl.initialize();
    expect(ctrl.selectedRole).toBe('Select one');
    expect(ctrl.roleSelection).toBe('Please Select A Role');

  });

});
