//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('title', function() {
  var $controller;
  var $rootScope;
  var $compile;
  var $httpMock;

  beforeEach(module('common.title'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$compile_, $httpBackend) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $httpMock = $httpBackend;
  }));

  it('should init title', function() {
    var route = {
      current: {
        pageTitle: 'test'
      }
    };

    var controller = $controller('PageTitleController', {
      $route: route,
      $rootScope: $rootScope
    });
    // I hard set the "Service Provider Workbench" in the HTML to fix a couple of edge cases
    // The pageTitle isn't updated until after the route change
    $rootScope.$emit('$routeChangeSuccess');
    expect(controller.pageTitle).toBe('test');
  });

  it('should compile title directive', function() {
    $httpMock.expectGET('components/app/title/title.html').respond('');
    $compile('<div page-title></div>');
    $rootScope.$digest();
    $httpMock.flush();
  });
});
