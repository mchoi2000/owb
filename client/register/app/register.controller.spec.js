'use strict';

describe('Register controller', function() {
  var $httpBackend;
  var $controller;
  var ctrl;

  var $window = {
    location: {
      href: ''
    }
  };

  beforeEach(module('register'));

  beforeEach(inject(function(_$httpBackend_, _$controller_) {
    $httpBackend = _$httpBackend_;
    $controller = _$controller_;
    ctrl = $controller('RegistrationController', {
      $window: $window
    });

    $httpBackend.when('GET', 'api/locales').respond(200,
      [
        {name: 'Test1', locale: 'code1'},
        {name: 'Test2', locale: 'code2'},
        {name: 'Test3', locale: 'code3'}
      ]
    );
    $httpBackend.when('GET', 'api/catalog/getTMTContactModules').respond(200, {
        'BU1': 'Name1',
        'BU2': 'Name2',
        'BU3': 'Name3'
      }
    );
    $httpBackend.when('GET', 'api/user').respond(200, {_id: 'userId'});
  }));

  it('should initialize', function() {
    ctrl.initialize();
    $httpBackend.flush();
    expect(ctrl.user._id).toEqual('userId');
    expect(ctrl.locales).toEqual({
      'code1': 'Test1',
      'code2': 'Test2',
      'code3': 'Test3'
    });
    expect(ctrl.businessUnits).toEqual(['BU1', 'BU2', 'BU3']);
  });

  it('should select locales', function() {
    ctrl.selectedLocales = ['code2', 'code3'];
    ctrl.changeLocales();
    expect(ctrl.localeRoleMaps).toEqual([
      {'locale':'code2','role':''},{'locale':'code3','role':''}
    ]);
    expect(ctrl.showOther).toEqual([false,false]);
  });

  it('should select locales that are already present', function() {
    ctrl.localeRoleMaps = [{'locale':'code2','role':''}];
    ctrl.selectedLocales = ['code2', 'code3'];
    ctrl.changeLocales();
    expect(ctrl.localeRoleMaps).toEqual([
      {'locale':'code2','role':''},{'locale':'code3','role':''}
    ]);
    expect(ctrl.showOther).toEqual([false,false]);
  });

  it('should update role: Role = Other', function() {
    ctrl.showOther = [false, false];
    var lObj = {'locale': 'code1', 'role': ''};
    ctrl.updateRoleOption(lObj, 'Other', 0);
    expect(lObj).toEqual(lObj);
    expect(ctrl.showOther[0]).toBeTruthy();
  });

  it('should update role', function() {
    ctrl.showOther = [false, false];
    var lObj = {'locale': 'code1', 'role': ''};
    ctrl.updateRoleOption(lObj, 'Manager', 0);
    expect(lObj.role).toEqual('Manager');
    expect(ctrl.showOther[0]).toBeFalsy();
  });

  it('should check to see if roles are empty', function() {
    ctrl.localeRoleMaps = [{'locale':'code2','role':''}];
    expect(ctrl.checkAllRoles()).toBeTruthy();
  });

  it('should check role is portfolio', function() {
    ctrl.localeRoleMaps = [{'locale':'code2','role':'Portfolio manager'}];
    expect(ctrl.isRolePortfolio()).toBeTruthy();
  });

  it('should accept registration: role and BU not updated', function() {
    ctrl.user = {fname: '', lname: '', info: {}};
    $httpBackend.when('POST', 'auth/register/cmm').respond(200, {});

    ctrl.acceptRegistration({'$invalid': false});
    $httpBackend.flush();

    expect($window.location.href).toEqual('review/cmm');
  });

  it('should accept registration: role and BU updated', function() {
    ctrl.user = {fname: '', lname: '', info: {}};
    ctrl.localeRoleMaps = [{'locale':'code2','role':''}];
    ctrl.selecteBUs = ['BU1', 'BU2', 'BU3'];
    $httpBackend.when('POST', 'auth/register/cmm').respond(200, {});

    ctrl.acceptRegistration({'$invalid': false});
    $httpBackend.flush();

    expect($window.location.href).toEqual('review/cmm');
  });

  it('should accept registration: form error', function() {
    ctrl.acceptRegistration({'$invalid': true});
  });
});
