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
  var userLocalesUndefined = true;

  var mockBlacklistService = {
    getLocales: function() {
      return $q.resolve([
        {'locale':'es-ar','country':'Argentina','language':'Español'},
        {'locale':'en-aw','country':'Aruba','language':'English'},
        {'locale':'en-au','country':'Australia','language':'English'},
        {'locale':'fr-au','country':'Australia','language':'French'}]);
    }
  };
  var mockUserService = {
    get: function() {
      if (userLocalesUndefined) {
        return $q.resolve({});
      } else {
        return $q.resolve({locales: []});
      }
    },
    joinLocale: function(newLocaleArray) {
      return $q.resolve({config: {data: newLocaleArray}});
    }
  };

  beforeEach(module('review.cmmDash'));

  beforeEach(inject(function(_$httpBackend_, _$q_, _$rootScope_, _$controller_) {
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;

    ctrlDash = _$controller_('CMMDashboard', {
      BlackListCountriesService: mockBlacklistService,
      UserService: mockUserService
    });

  }));

  it('should initialize', function() {
    ctrlDash.initialize();
    $rootScope.$apply();

    expect(ctrlDash.localeList).toEqual([
      {'locale':'es-ar','country':'Argentina','language':'Español'},
      {'locale':'en-aw','country':'Aruba','language':'English'},
      {'locale':'en-au','country':'Australia','language':'English'},
      {'locale':'fr-au','country':'Australia','language':'French'}]);
    expect(ctrlDash.localeLanguageMap).toEqual({'Argentina':1,'Aruba':1,'Australia':2});
    expect(ctrlDash.userLocales).toEqual({});
  });

  it('should join a locale: if locale supports more than one lang', function() {
    userLocalesUndefined = false;
    ctrlDash.initialize();
    $rootScope.$apply();
    ctrlDash.joinLocale('fr-au', 'editor');
    $rootScope.$apply();
    expect(ctrlDash.userLocales).toEqual({'fr-au':'Australia (French)'});
    expect(ctrlDash.currentUser.locales).toEqual([{'locale':'fr-au','roles':['editor']}]);
  });

  it('should join a locale: if locale supports only one lang', function() {
    userLocalesUndefined = true;
    ctrlDash.initialize();
    $rootScope.$apply();
    ctrlDash.joinLocale('es-ar', 'editor');
    $rootScope.$apply();
    expect(ctrlDash.userLocales).toEqual({'es-ar':'Argentina'});
    expect(ctrlDash.currentUser.locales).toEqual([{'locale':'es-ar','roles':['editor']}]);
  });

});
