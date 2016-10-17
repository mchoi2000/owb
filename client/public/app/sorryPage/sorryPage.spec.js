//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('sorry page route', function() {
  var $location;
  var $route;
  var $rootScope;
  var $httpBackend;

  beforeEach(module('public.sorry'));

  beforeEach(inject(function($injector, _$location_, _$route_, _$rootScope_) {
    $location = _$location_;
    $route = _$route_;
    $rootScope = _$rootScope_;
    $httpBackend = $injector.get('$httpBackend');
  }));

  it('should route to sorry', function() {
    $httpBackend.expect('GET', 'app/sorryPage/sorryPage.html').respond('<div></div>');
    $location.path('/sorryPage');
    $rootScope.$digest();
  });

});
