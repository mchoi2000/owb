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

  beforeEach(module('review.cmmDir'));

  beforeEach(inject(function(_$httpBackend_, _$q_, _$rootScope_, _$controller_) {
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;

    ctrlDir = _$controller_('CMMDirectory', {
      BlackListCountriesService: mockBlacklistService,
      UserService: mockUserService
    });

  }));

  it('should initialize', function() {
    ctrlDir.initialize();
    $rootScope.$apply();

    expect(ctrlDir.localeList).toEqual([
      {'locale':'es-ar','country':'Argentina','language':'Español'},
      {'locale':'en-aw','country':'Aruba','language':'English'},
      {'locale':'en-au','country':'Australia','language':'English'},
      {'locale':'fr-au','country':'Australia','language':'French'}]);
    expect(ctrlDir.localeLanguageMap).toEqual({'Argentina':1,'Aruba':1,'Australia':2});
    expect(ctrlDir.userLocales).toEqual({});
  });

  it('should join a locale: if locale supports more than one lang', function() {
    userLocalesUndefined = false;
    ctrlDir.initialize();
    $rootScope.$apply();
    ctrlDir.joinLocale('fr-au', 'editor');
    $rootScope.$apply();
    expect(ctrlDir.userLocales).toEqual({'fr-au':'Australia (French)'});
    expect(ctrlDir.currentUser.locales).toEqual([{'locale':'fr-au','roles':['editor']}]);
  });

  it('should join a locale: if locale supports only one lang', function() {
    userLocalesUndefined = true;
    ctrlDir.initialize();
    $rootScope.$apply();
    ctrlDir.joinLocale('es-ar', 'editor');
    $rootScope.$apply();
    expect(ctrlDir.userLocales).toEqual({'es-ar':'Argentina'});
    expect(ctrlDir.currentUser.locales).toEqual([{'locale':'es-ar','roles':['editor']}]);
  });

});
