//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('CMM Dashboard Controller Spec', function() {
  var ctrlDash;
  var $httpBackend;
  var $q;
  var $rootScope;
  var $mockRouteParams = {
    locale: 'fr-ca'
  };

  var $window = {
    location : {
      href: ''
    }
  };

  beforeEach(module('review.cmmDashboard'));
  beforeEach(function() {
    module(function($provide) {
      $provide.value('$window', $window);
    });
  });

  beforeEach(inject(function(_$httpBackend_, _$q_, _$rootScope_, _$controller_) {
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;

    ctrlDash = _$controller_('CMMDashboardController', {
      $routeParams: $mockRouteParams
    });
  }));

  it('should initialize', function() {
    $httpBackend.whenGET('api/locales/getOfferingsByLanguage/frca')
    .respond({docs: [{}, {}, {}]});
    $httpBackend.whenGET('api/user').respond({settings: {initialCmmVisit: 0}});
    ctrlDash.initialize();
    $httpBackend.flush();

    expect(ctrlDash.offerings.length).toEqual(3);
    expect(ctrlDash.joined).toBeFalsy();
    expect(ctrlDash.baseLanguageCode).toEqual('frca');
    expect(ctrlDash.countryDisplayVal).toEqual('Canada');
    expect(ctrlDash.languageDisplayVal).toEqual('French');
  });

  it('should join locale', function() {
    $httpBackend.whenGET('api/locales/getOfferingsByLanguage/frca')
    .respond({docs: [{}, {}, {}]});
    $httpBackend.whenGET('api/user')
    .respond({settings: {initialCmmVisit: 1}});
    $httpBackend.whenPOST('api/user/joinLocale', [{locale: 'fr-ca', roles: ['editor']}])
    .respond({locales: [{locale: 'fr-ca', roles: ['editor']}], settings: {initialCmmVisit: 1}});
    ctrlDash.initialize();
    ctrlDash.joinLocale();
    $httpBackend.flush();
  });

  it('should join locale', function() {
    ctrlDash.userDetails.locales = [{locale: 'en-us', roles: ['editor']}];
    $httpBackend.whenGET('api/locales/getOfferingsByLanguage/frca')
    .respond({docs: [{}, {}, {}]});
    $httpBackend.whenGET('api/user')
    .respond({
      locales: [{locale: 'en-us', roles: ['editor']}],
      settings: {initialCmmVisit: 1}
    });
    $httpBackend.whenPOST('api/user/joinLocale',
    [{locale: 'en-us', roles: ['editor']}, {locale: 'fr-ca', roles: ['editor']}])
    .respond({
      locales: [{locale: 'en-us', roles: ['editor']}, {locale: 'fr-ca', roles: ['editor']}]
    });
    ctrlDash.joinLocale();
    $httpBackend.flush();
  });

  it('should redirect to cmm review page', function() {
    $httpBackend.whenGET('api/locales/getOfferingsByLanguage/frca')
    .respond({docs: [{}, {}, {}]});
    $httpBackend.whenGET('api/user').respond({settings: {initialCmmVisit: 0}});

    ctrlDash.openReviewPage();
    $httpBackend.flush();
    expect($window.location.href).toEqual('review/cmm');
  });

});
