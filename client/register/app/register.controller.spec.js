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
  }));

  it('should get user', function() {
    var ctrl = $controller('RegistrationController');
    $httpBackend.expect('GET', 'api/user').respond({_id: 'userId'});
    ctrl.getUser();
    $httpBackend.flush();
    expect(ctrl.user._id).toBe('userId');
  });

  it('should open terms of use', function() {
    var ctrl = $controller('RegistrationController');
    ctrl.openTermsOfUseModal();
    expect(typeof ctrl.modalInstance === 'undefined').toBe(false);
  });

  it('should accept registration', function() {
    var ctrl = $controller('RegistrationController');
    ctrl.role = 'test';

    var projectRoleField = {};
    projectRoleField.$setViewValue = function(viewValue) {
      expect(viewValue).toBe('test');
    };

    $httpBackend.expect('POST', 'auth/register', undefined).respond({});
    ctrl.acceptRegistration({
      $invalid: false,
      projectRole: projectRoleField
    });

    $httpBackend.flush();
  });

  it('should accept registration (invalid form)', function() {
    var ctrl = $controller('RegistrationController');
    ctrl.role = 'test';

    var projectRoleField = {};
    projectRoleField.$setViewValue = function(viewValue) {
      expect(viewValue).toBe('test');
    };

    ctrl.acceptRegistration({
      $invalid: true,
      projectRole: projectRoleField
    });
  });

  it('should update the role option', function() {
    var ctrl = $controller('RegistrationController');

    ctrl.updateRoleOption('test', true);
    expect(ctrl.role).toBe('test');

    ctrl.updateRoleOption('Other', true);
    expect(ctrl.role).toBe('');

    ctrl.updateRoleOption('test', false);
    expect(ctrl.role).toBe('test');
  });
});
