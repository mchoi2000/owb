//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

describe('CMM Review Form Controller Spec', function() {
  var ctrl;
  var $httpBackend;
  var $routeParams;
  var $rootScope;
  var $timeout;
  var $q;
  var $controller;
  var testProduct;

  var $window = {
    location: {
      href: function(path) {
        path.toBeDefined();
      }
    },
    addEventListener : function() {
      return;
    }
  };

  var myNavigationService = function NavService(sectionList) {
    this.sectionList = sectionList;
  };

  var mockUser = {};
  var mockProducts = {};
  var mockBlacklistService = {};
  var languageDisplayName = {};

  myNavigationService.prototype.scrollToSection = function () {
    this.currentSection = 'Key Benefits';
    this.stickNav = true;
  };

  beforeEach(module('review.cmm'));

  beforeEach(inject(function(_$httpBackend_, _$controller_, _$routeParams_, _$rootScope_,
                             _$timeout_, _$q_) {
    $httpBackend = _$httpBackend_;
    $routeParams = _$routeParams_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    $q = _$q_;
    $controller = _$controller_;

    testProduct = {
      offeringManager: {
        firstName: '',
        lastName: '',
        email: ''
      },
      marketingManager: {
        firstName: '',
        lastName: '',
        email: ''
      },
      wcm: {
        productionId: 'testContent'
      },
      countryMktConfig: {
        'T1': {
          globalizationMgr: {blacklisted: false},
          offeringMgr: {blacklisted: true, reason: 'ROM1'}
        },
        'T2': {globalizationMgr: {blacklisted: true, reason: 0}},
        'T3': {
          globalizationMgr: {
            blacklisted: true,
            reason: 'test',
            lastModified: {by: 'testUser', at: '12345'}
          }
        },
        'T4': {
          globalizationMgr: {
            blacklisted: false,
            lastModified: {by: 'testUser', at: '12345'}
          }
        },
        'T5': {globalizationMgr: {blacklisted: true, reason: 'RGM1'}}
      }
    };

    mockBlacklistService.getCountries = function() {
      return $q.resolve({data: [
        {area: '1', IOT: '1', name: 'Test1', languages: ['en-us', 'fr-fr', 'es-LA'], code: 'T1'},
        {area: '1', IOT: '1', name: 'Test2', languages: ['en-us', 'fr-ca'], code: 'T2'},
        {area: '1', IOT: '1', name: 'Test3', languages: ['en-us', 'fr-fr'], code: 'T3'},
        {area: '1', IOT: '1', name: 'Test4', languages: ['en-us'], code: 'T4'},
        {area: '1', IOT: '1', name: 'Test5', languages: ['en-us'], code: 'T5'},
        {area: '1', IOT: '1', name: 'Test6', languages: [], code: 'T6'},
        {area: '1', IOT: '1', name: 'United States', languages: ['en-us'], code: 'US'},
        {area: '1', IOT: '1', name: 'France', languages: ['fr-fr'], code: 'FR'},
        {area: '1', IOT: '1', name: 'Canada', languages: ['en-us', 'fr-ca'], code: 'CA'},
        {area: '1', IOT: '1', name: 'Germany', languages: ['de-de'], code: 'DE'},
        {area: '1', IOT: '1', name: 'Spain', languages: ['es-es'], code: 'ES'}
      ]});
    };

    mockProducts.getProduct = function() {
      return $q.resolve({
        data: testProduct
      });
    };

    mockProducts.getByContentId = function() {
      return $q.resolve({
        data: {
          value: {
            product: {
              key: 'englishContent',
              'related-products': [{'product-key': 'key'}],
              'locale-support': {
                blacklist: [
                  {country: 'Test1', reason: {offeringMgr: 'ROM1', globalizationMgr: 'RGM2'}},
                  {country: 'Test2', reason: {offeringMgr: 'ROM1', globalizationMgr: 0}},
                  {country: 'Test4', reason: {globalizationMgr: 0}},
                  {country: 'Test6', reason: {offeringMgr: 'ROM1', globalizationMgr: 'RGM1'}}]
              }
            }
          },
          i18n: {
            'de-de': {
              value: {
                product: {
                  key: 'germanContent'
                }
              }
            },
            'fr-fr': {
              value: {
                product: {
                  key: 'frenchContent'
                }
              }
            },
            'fr-ca': {
              value: {
                product: {
                  key: 'frenchCanadian'
                }
              }
            },
            'es-LA': {
              value: {
                product: {
                  key: 'frenchCanadian'
                }
              }
            }
          }
        }
      });
    };

    mockUser.getUser = function() {
      return $q.resolve({
        fname: '',
        lname: '',
        email: ''
      });
    };

    mockUser.get = function() {
      return $q.resolve({
        fname: 'current',
        lname: 'user',
        email: 'test.test@test'
      });
    };

    languageDisplayName.getDisplayName = function () {
      return 'Display Name';
    };

    ctrl = $controller('ctrlCMMReviewForm', {
      $window: $window,
      NavigationService: myNavigationService,
      ProductsFactory: mockProducts,
      BlackListCountriesService: mockBlacklistService,
      UserService: mockUser,
      LanguageDisplayName: languageDisplayName
    });
    ctrl.commerceReviewer = 'testEmail@myUserService.com';
  }));

  it('should init', function(done) {
    ctrl.initialize();

    $rootScope.$apply();
    $timeout.flush(1000);
    $timeout(done);
    $timeout.flush(1000);
  });

  it('should init - err on get display name', function(done) {

    languageDisplayName.getDisplayName = function () {
      throw {err: 'err'};
    };

    ctrl = $controller('ctrlCMMReviewForm', {
      $window: $window,
      NavigationService: myNavigationService,
      ProductsFactory: mockProducts,
      BlackListCountriesService: mockBlacklistService,
      UserService: mockUser,
      LanguageDisplayName: languageDisplayName
    });

    ctrl.initialize();

    $rootScope.$apply();
    $timeout.flush(1000);
    $timeout(done);
    $timeout.flush(1000);
  });

  it('should init (alt)', function(done) {
    mockUser.getUser = function() {
      return $q.resolve({
        fname: '',
        lname: '',
        email: '',
        projectRole: 'Marketing Manager'
      });
    };

    delete testProduct.offeringManager;
    delete testProduct.marketingManager;
    delete testProduct.countryMktConfig;

    ctrl = $controller('ctrlCMMReviewForm', {
      $window: $window,
      NavigationService: myNavigationService,
      ProductsFactory: mockProducts,
      BlackListCountriesService: mockBlacklistService,
      UserService: mockUser,
      LanguageDisplayName: languageDisplayName
    });

    ctrl.initialize()
      .then(function() {
        done();
      });

    $rootScope.$apply();
    $timeout.flush(1000);
    $timeout(done);
    $timeout.flush(1000);
  });

  it('should make a list string separated by commas', function() {
    var arr = ['English', 'Spanish', 'Mandarin'];
    expect(ctrl.listMaker(arr)).toEqual('English, Spanish, Mandarin');
  });

  it('should return none on an empty array', function() {
    var arr = [];
    expect(ctrl.listMaker(arr)).toEqual('NONE');
  });

  it('should check nav on scroll', function() {
    ctrl.onScroll();
    expect(ctrl.navs[0].stickNav).toEqual(true);
  });

  it('should check blacklist functionality', function () {
    ctrl.product = testProduct;
    ctrl.currentUser = {
      _id: 'testUser'
    };
    ctrl.modifyBlacklist(false, 'T1');
    expect(ctrl.product.countryMktConfig.T1.globalizationMgr.reason).toEqual('');
    expect(ctrl.product.countryMktConfig.T1.globalizationMgr.blacklisted).toEqual(true);
    expect(ctrl.product.countryMktConfig.T1.globalizationMgr.lastModified.by)
      .toEqual(ctrl.currentUser._id);
    expect(ctrl.blacklistList[0]).toEqual({locale: 'T1', reason: ''});
    ctrl.modifyBlacklist(true, 'T1');
    expect(ctrl.product.countryMktConfig.T1.globalizationMgr.reason).toEqual(undefined);
    expect(ctrl.product.countryMktConfig.T1.globalizationMgr.blacklisted).toEqual(false);
    expect(ctrl.product.countryMktConfig.T1.globalizationMgr.lastModified.by)
      .toEqual(ctrl.currentUser._id);
    expect(ctrl.blacklistList[0]).toEqual();
    ctrl.modifyBlacklist(false, 'T1');
    expect(ctrl.blacklistList[0]).toEqual({locale: 'T1', reason: ''});
    ctrl.addReasonToBlacklist('T1', 'Reason 1');
    expect(ctrl.product.countryMktConfig.T1.globalizationMgr.reason).toEqual('Reason 1');
    expect(ctrl.product.countryMktConfig.T1.globalizationMgr.blacklisted).toEqual(true);
    expect(ctrl.product.countryMktConfig.T1.globalizationMgr.lastModified.by)
      .toEqual(ctrl.currentUser._id);
    expect(ctrl.blacklistList[0]).toEqual({locale: 'T1', reason: 'Reason 1'});
    ctrl.addReasonToBlacklist('T3', 'Reason 1');
    expect(ctrl.blacklistList[0]).toEqual({locale: 'T1', reason: 'Reason 1'});
    ctrl.modifyBlacklist(true, 'T2');
    ctrl.modifyBlacklist(false, 'T4');
    ctrl.modifyBlacklist(false, 'T2');
  });

  it('should remove blacklists', function() {
    ctrl.blacklistList = [
      {
        locale: 'TX'
      },
      {
        locale: 'NY'
      }
    ];

    ctrl.product = {
      countryMktConfig: {
        TX: {
          globalizationMgr: {
            blacklisted: false,
            reason: 1
          }
        }
      }
    };

    ctrl.currentUser = {
      id: 1
    };

    ctrl.removeFromLists({code: 'TX'});

    expect(ctrl.blacklistList.length).toBe(1);
    expect(ctrl.product.countryMktConfig.TX.globalizationMgr.blacklisted).toBe(true);
  });

  it('should go to section', function () {
    $routeParams.id = 'testId';
    ctrl.product = {countryMktConfig: {}};
    $httpBackend.expectPOST('api/translation/blacklistOffering/testId',
      {blacklistLocales: [], marketConfig: {}})
      .respond({status: 200, data: 'hello'});
    ctrl.saveBlacklistOffering(false);
    $httpBackend.flush();
    $timeout.flush();
  });

  it('should go to section', function () {
    $routeParams.id = 'testId';
    ctrl.product = {countryMktConfig: {}};
    $httpBackend.expectPOST('api/translation/blacklistOffering/testId',
      {blacklistLocales: [], marketConfig: {}})
      .respond({status: 200, data: 'hello'});
    ctrl.saveBlacklistOffering(true);
    $httpBackend.flush();
  });

  it('should select language', function(done) {
    ctrl.initialize()
      .then(function () {
        $timeout(function() {
          ctrl.selectLanguage(ctrl.locales[1]);
          expect(ctrl.content.key).toEqual('germanContent');
          ctrl.selectLanguage(ctrl.locales[0]);
          expect(ctrl.content.key).toEqual('englishContent');
          done();
        });
      });

    $rootScope.$apply();
    $timeout.flush(1000);
  });

  it('test expandSection', function() {
    ctrl.sectionTabsCollapse = {
      test: true
    };
    ctrl.expandSection('test');
    expect(ctrl.sectionTabsCollapse.test).toBeFalsy();
  });

  it('test expandIOTSection', function() {
    ctrl.IOTs = [{
      label: 'test',
      collapsed: true,
      group: [{
        collapsed: true
      }]
    }];

    ctrl.expandIOTSection('test');
    expect(ctrl.IOTs[0].collapsed).toBeFalsy();

    ctrl.expandIOTSection('invalidKey');
  });

});
