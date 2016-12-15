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
  var userLocalesUndefined = false;

  var mockUserService = {
    get: function() {
      if (userLocalesUndefined) {
        return q.resolve({settings: {initialCmmVisit: 1}});
      } else {
        return q.resolve({
            locales: [{locale:'en-au', roles:['owner']},
              {locale:'fr-au', roles:['owner']},
              {locale:'es-ar', roles:['editor']}],
            settings: {initialCmmVisit: 0}
          });
      }
    }
  };
  var mockBlackListCountriesService = {
    getLocales: function() {
      return q.resolve([
        {'locale':'es-ar','country':'Argentina','language':'Español'},
        {'locale':'en-aw','country':'Aruba','language':'English'},
        {'locale':'en-au','country':'Australia','language':'English'},
        {'locale':'fr-au','country':'Australia','language':'French'},
        {'locale':'en-ba','country':'Barbados','language':'English'},
        {'locale':'pt-br','country':'Brasil','language':'Portugese'}]);
    }
  };

  beforeEach(module('common.header'));

  beforeEach(inject(function(_$controller_, $q, $rootScope, $compile, $httpBackend) {
    $controller = _$controller_;
    q = $q;
    rootScope = $rootScope;
    compile = $compile;
    httpMock = $httpBackend;
  }));

  it('should init the header controller', function() {

    var $route = {
      current: {
        pageSlug: 'someSlug',
        pageTitle: 'someTitle'
      }
    };
    var $location = {
      path: function() {return '/somepath';}
    };

    var controller = $controller('HeaderController', {
      UserService: mockUserService,
      BlackListCountriesService: mockBlackListCountriesService,
      $q: q,
      $route: $route,
      $location: $location
    });
    rootScope.$apply();

    expect(controller.pageSlug).toBe($route.current.pageSlug);
    expect(controller.pageTitle).toBe($route.current.pageTitle);
  });

  it('should init the header controller when user has no locales', function() {
    userLocalesUndefined = true;
    var $route = {
      current: {
        pageSlug: 'someSlug',
        pageTitle: 'someTitle'
      }
    };
    var $location = {
      path: function() {return '/somepath';}
    };

    var controller = $controller('HeaderController', {
      UserService: mockUserService,
      BlackListCountriesService: mockBlackListCountriesService,
      $q: q,
      $route: $route,
      $location: $location
    });
    rootScope.$apply();

    expect(controller.pageSlug).toBe($route.current.pageSlug);
    expect(controller.pageTitle).toBe($route.current.pageTitle);
  });

  it('should init on register page', function() {
    var $route = {};
    var $location = {
      path: function() {return '/register/register.html';}
    };
    var controller = $controller('HeaderController', {
      UserService: mockUserService,
      BlackListCountriesService: mockBlackListCountriesService,
      $q: q,
      $route: $route,
      $location: $location
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
