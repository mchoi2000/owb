//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('CMM Directory Controller Spec', function() {
  var ctrlDir;
  var $httpBackend;
  var $q;
  var $rootScope;
  var $timeout;
  var userLocalesUndefined = true;
  var spy;

  var mockBlacklistService = {
    getLocales: function() {
      return $q.resolve([
        {'locale':'es-ar','country':'Argentina','language':'Español'},
        {'locale':'en-aw','country':'Aruba','language':'English'},
        {'locale':'en-au','country':'Australia','language':'English'},
        {'locale':'fr-au','country':'Australia','language':'French'},
        {'locale':'en-ba','country':'Barbados','language':'English'},
        {'locale':'pt-br','country':'Brasil','language':'Portugese'}]);
    }
  };
  var mockUserService = {
    get: function() {
      if (userLocalesUndefined) {
        return $q.resolve({settings: {initialCmmVisit: 1}});
      } else {
        return $q.resolve({locales: [], settings: {initialCmmVisit: 0}});
      }
    },
    joinLocale: function(newLocaleArray) {
      return $q.resolve({config: {data: newLocaleArray}});
    },
    updateUser: function(user) {
      return $q.resolve({});
    }
  };
  var $anchorScroll = jasmine.createSpy('anchorScroll');
  var $window = {
    addEventListener : function(elem, cb) {
      if (elem === 'scroll') {
        cb();
      }
    },
    location: {
      href: ''
    }
  };

  beforeEach(module('review.cmmDirectory'));
  beforeEach(function() {
    module(function($provide) {
      $provide.value('$window', $window);
      $provide.value('$anchorScroll', $anchorScroll);
    });
  });

  beforeEach(inject(function(_$httpBackend_, _$q_, _$rootScope_, _$timeout_, _$controller_) {
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    spyOn(document, 'querySelector').and.callFake(function (ele) {
      return 181;
    });
    spy = spyOn(angular, 'element').and.callFake(function (element) {
      return {
        offset: function() {
          return {
            top:  element
          };
        }
      };
    });

    ctrlDir = _$controller_('CMMDirectoryController', {
      BlackListCountriesService: mockBlacklistService,
      UserService: mockUserService
    });
  }));

  afterEach(function() {
    spy.and.callThrough();
  });

  it('should initialize', function() {
    ctrlDir.initialize();
    $rootScope.$apply();

    expect(ctrlDir.localeList).toEqual([
      {'locale':'es-ar','country':'Argentina','language':'Español'},
      {'locale':'en-aw','country':'Aruba','language':'English'},
      {'locale':'en-au','country':'Australia','language':'English'},
      {'locale':'fr-au','country':'Australia','language':'French'},
      {'locale':'en-ba','country':'Barbados','language':'English'},
      {'locale':'pt-br','country':'Brasil','language':'Portugese'}]);
    expect(ctrlDir.localeLanguageMap).toEqual(
      {'Argentina':1,'Aruba':1,'Australia':2,'Brasil': 1,'Barbados': 1});
    expect(ctrlDir.userLocales).toEqual({});
  });

  it('should join a locale: if locale supports more than one lang', function() {
    $window.pageYOffset = 750;
    userLocalesUndefined = false;
    ctrlDir.initialize();
    $rootScope.$apply();
    ctrlDir.joinLocale('fr-au', 'editor');
    $rootScope.$apply();
    expect(ctrlDir.userLocales).toEqual({'fr-au':'Australia (French)'});
    expect(ctrlDir.currentUser.locales).toEqual([{'locale':'fr-au','roles':['editor']}]);
  });

  it('should join a locale: if locale supports only one lang', function() {
    $window.pageYOffset = 750;
    userLocalesUndefined = true;
    ctrlDir.initialize();
    $rootScope.$apply();
    ctrlDir.joinLocale('es-ar', 'editor');
    $rootScope.$apply();
    expect(ctrlDir.userLocales).toEqual({'es-ar':'Argentina'});
    expect(ctrlDir.currentUser.locales).toEqual([{'locale':'es-ar','roles':['editor']}]);
  });

  it('should scroll to the right locale', function() {
    ctrlDir.initialize();
    $rootScope.$apply();

    var index = 'B';
    var firstIndexedCountry = ctrlDir.localeList.filter(function(obj) {
      return obj.country.charAt(0) === index;
    })[0].country;
    ctrlDir.scrollToCountry(index);
    $timeout.flush();
    expect($anchorScroll).toHaveBeenCalledWith(firstIndexedCountry);

    ctrlDir.sortOption = 'language';
    ctrlDir.scrollToCountry(index);
    $timeout.flush();
    expect($anchorScroll).toHaveBeenCalledWith(firstIndexedCountry);

    ctrlDir.sortOption = 'country';
    ctrlDir.sortField = true;
    ctrlDir.scrollToCountry(index);
    $timeout.flush();
    expect($anchorScroll).toHaveBeenCalledWith('Brasil');
  });

  it('should test anchoring: top disclosure hidden', function() {
    $window.pageYOffset = 750;
    ctrlDir.initialize();
    $rootScope.$apply();

    expect(ctrlDir.fixRightNav).toBeTruthy();
    expect(ctrlDir.fixTableContent).toBeTruthy();
  });

  it('should test anchoring: top disclosure shown', function() {
    ctrlDir.disclosureHidden = false;
    $window.pageYOffset = 750;
    ctrlDir.initializeStickyService();
    expect(ctrlDir.fixTableContent).toBeTruthy();
  });

  it('should change sort option', function() {
    ctrlDir.changeSortOption('country');
    expect(ctrlDir.sortOption).toEqual('country');
  });

  it('should open review dashboard', function() {
    ctrlDir.openLocale('fr-ca');
    expect($window.location.href).toEqual('review/cmm/dashboard/fr-ca');
  });

});
