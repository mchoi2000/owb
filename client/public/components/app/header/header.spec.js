//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('header', function() {
  var $controller;
  var q;
  var rootScope;
  var compile;
  var httpMock;

  beforeEach(module('common.header'));

  beforeEach(inject(function(_$controller_, $q, $rootScope, $compile, $httpBackend) {
    $controller = _$controller_;
    q = $q;
    rootScope = $rootScope;
    compile = $compile;
    httpMock = $httpBackend;
  }));

  it('should init the header controller', function() {
    var UserService = {
      get: function() {
        var deferred = q.defer();
        deferred.resolve({features: ['some feature']});
        return deferred.promise;
      }
    };
    var $route = {
      current: {
        pageSlug: 'someSlug',
        pageTitle: 'someTitle'
      }
    };
    var $location = {
      path: function() {return '/somepath';}
    };
    var featureFlags = {
      set: function(features) {
        expect(features[0].key).toBe('some feature');
        expect(features[0].active).toBe(true);
      }
    };
    var controller = $controller('HeaderController', {
      UserService: UserService,
      $route: $route,
      $location: $location,
      featureFlags: featureFlags
    });
    rootScope.$apply();

    expect(controller.pageSlug).toBe($route.current.pageSlug);
    expect(controller.pageTitle).toBe($route.current.pageTitle);
  });

  it('should init on register page', function() {
    var UserService = {
      get: function() {
        var deferred = q.defer();
        deferred.resolve({});
        return deferred.promise;
      }
    };
    var $route = {};
    var $location = {
      path: function() {return '/register/register.html';}
    };
    var featureFlags = {};
    var controller = $controller('HeaderController', {
      UserService: UserService,
      $route: $route,
      $location: $location,
      featureFlags: featureFlags
    });
    rootScope.$apply();

    expect(controller.pageSlug).toBe('register');
    expect(controller.pageTitle).toBe('Join the Globalization Workbench');
  });

  it('should compile header directive', function() {
    httpMock.expectGET('components/app/header/header.html').respond('<header></header>');
    compile('<div header></div>');
    rootScope.$digest();
    httpMock.flush();
  });
});
