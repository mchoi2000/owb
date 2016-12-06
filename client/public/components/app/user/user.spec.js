//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

describe('User Service', function() {
  var $q;
  var $rootScope;
  var $httpBackend;

  var service;

  beforeEach(module('common.user'));

  beforeEach(inject(function($injector, _$q_, _$rootScope_, _UserService_) {
    service = _UserService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $httpBackend = $injector.get('$httpBackend');
  }));

  it('should get user', function (done) {
    $httpBackend.when('GET', 'api/user/testId').respond({id: 'userId'});
    service.getUser('testId')
      .then(function(user) {
        expect(user.id).toBe('userId');
        done();
      });
    $httpBackend.flush();
  });

  it('should get current user', function(done) {
    $httpBackend.when('GET', 'api/user').respond({id: 'userId'});
    service.get()
      .then(function(user) {
        expect(user.id).toBe('userId');
        done();
      });
    $httpBackend.flush();
  });

  it('should get all users', function (done) {
    $httpBackend.when('GET', 'api/user/all').respond({id: 'userId'});
    service.getAll()
      .then(function(user) {
        expect(user.id).toBe('userId');
        done();
      });
    $httpBackend.flush();
  });

  it('should update features', function (done) {
    $httpBackend.when('POST', 'api/user/updateFeatures/testId', ['feature']).respond({});
    service.updateFeatures('testId', ['feature'])
      .then(function(result) {
        expect(result.status).toBe(200);
        done();
      });
    $httpBackend.flush();
  });

  it('should remove a user', function (done) {
    $httpBackend.when('POST', 'api/user/removeUsers', {data: 'data'}).respond({});
    service.removeUsers({data: 'data'})
      .then(function(result) {
        expect(result.status).toBe(200);
        done();
      });
    $httpBackend.flush();
  });

  it('should invite user', function(done) {
    $httpBackend.when('POST', 'api/user/invite/', {data: 'data'}).respond({});
    service.inviteUser({data: 'data'})
      .then(function(result) {
        expect(result.status).toBe(200);
        done();
      });
    $httpBackend.flush();
  });

  it('should resend an invite', function (done) {
    $httpBackend.when('POST', 'api/user/resendInvite', {data: 'data'}).respond({});
    service.resendInvite({data: 'data'})
      .then(function(result) {
        expect(result.status).toBe(200);
        done();
      });
    $httpBackend.flush();
  });

  it('should join locale', function (done) {
    $httpBackend.when('POST', 'api/user/joinLocale', [{'en-us': 'editor'}])
    .respond([{'en-us': 'editor'}]);
    service.joinLocale([{'en-us': 'editor'}])
      .then(function(result) {
        expect(result.status).toBe(200);
        done();
      });
    $httpBackend.flush();
  });

  it('should update a user', function (done) {
    $httpBackend.when('POST', 'api/user/updateUser', {data: 'data'}).respond({});
    service.updateUser({data: 'data'})
      .then(function(result) {
        expect(result.status).toBe(200);
        done();
      });
    $httpBackend.flush();
  });


});
