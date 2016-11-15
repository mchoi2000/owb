//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('CMM Dashboard Controller Spec', function() {
  var ctrlDash;
  var $httpBackend, cmmData;
  var $q;
  var $rootScope;
  var sampleProds = [
    {offeringName: 'Product A', cmc: {status: 'Approved'}, owner: 'AOwner'},
    {offeringName: 'Product D', cmc: {status: 'Approved'}, owner: 'DOwner'},
    {offeringName: 'Product E', cmc: {status: 'Approved'}, owner: 'EOwner'},
    {offeringName: 'Product F', cmc: {status: 'Approved'}, owner: 'FOwner'}
  ];

  var mockBlacklistService = {};

  beforeEach(module('review.cmmDash'));

  beforeEach(inject(function(_$httpBackend_, _cmmData_, _$q_, _$rootScope_, _$controller_) {
    $httpBackend = _$httpBackend_;
    cmmData = _cmmData_;
    $q = _$q_;
    $rootScope = _$rootScope_;

    mockBlacklistService.getCountries = function() {
      return $q.resolve({data: [
        {area: '1', IOT: '1', name: 'Test1', languages: ['en', 'fr'], code: 'T1'},
        {area: '1', IOT: '1', name: 'Test2', languages: ['en', 'fr'], code: 'T2'},
        {area: '1', IOT: '1', name: 'Test3', languages: ['en', 'fr'], code: 'T3'},
        {area: '1', IOT: '1', name: 'Test4', languages: ['en'], code: 'T4'},
        {area: '1', IOT: '1', name: 'Test5', languages: ['en'], code: 'T5'},
        {area: '1', IOT: '1', name: 'Test6', languages: [], code: 'T6'},
        {area: '1', IOT: '1', name: 'United States', languages: ['en'], code: 'US'},
        {area: '1', IOT: '1', name: 'France', languages: ['fr'], code: 'FR'},
        {area: '1', IOT: '1', name: 'Canada', languages: ['en', 'fr'], code: 'CA'},
        {area: '1', IOT: '1', name: 'Germany', languages: ['de'], code: 'DE'},
        {area: '1', IOT: '1', name: 'Spain', languages: ['es'], code: 'ES'}
      ]});
    };

    mockBlacklistService.getLocales = function() {
      console.log('sending the localeList:::');
      return $q.resolve([
        {country: 'country1', language: 'language1'},
        {country: 'country2', language: 'language2'},
        {country: 'country3', language: 'language3'}
      ]);
    };

    ctrlDash = _$controller_('CMMDashboard', {
      BlackListCountriesService: mockBlacklistService
    });

  }));

  it('should check the initialize', function() {
    ctrlDash.initialize();
    expect(ctrlDash.displayEmpty).toEqual(false);
    console.log('ctrlDash.localeList is:::', ctrlDash.localeList);

    expect(ctrlDash.localeList).toBeDefined();

    $rootScope.$apply();
  });

  /*it('should query the products from the database', function() {
    $httpBackend.whenGET('api/translation/getTranslateDocs').respond(200, {
      docs: sampleProds
    });
    ctrlDash.initialize();
    $httpBackend.flush();
    expect(ctrlDash.displayEmpty).toEqual(false);
    expect(ctrlDash.productList).toBeDefined();
  });

  it('should query the products from the database - empty', function() {
    $httpBackend.whenGET('api/translation/getTranslateDocs').respond(200, {
      docs: []
    });
    ctrlDash.initialize();
    $httpBackend.flush();
    expect(ctrlDash.displayEmpty).toEqual(true);
    expect(ctrlDash.productList).toEqual([]);
  });

  it('should filter countries by IOT', function() {
    expect(ctrlDash.countriesToFilter()).toEqual(ctrlDash.countryList);
    expect(ctrlDash.filterCountries({IOT: 'test'})).toEqual(true);
    expect(ctrlDash.filterCountries({IOT: 'test'})).toEqual(false);
  });

  it('should set selected languages', function() {
    ctrlDash.languageList[0].isSelected = true;
    ctrlDash.setSelectedLangs();
    expect(ctrlDash.selectedLangs.length).toEqual(1);
    expect(ctrlDash.selectedLangs[0].index).toEqual(0);
  });

  it('should un select and remove from selected', function() {
    ctrlDash.languageList[0].isSelected = true;
    ctrlDash.setSelectedLangs();
    ctrlDash.unSelectLang(0, 0);
    expect(ctrlDash.selectedLangs.length).toEqual(0);
  });

  it('should run updateSortProducts with false initial', function() {
    ctrlDash.updateSortProducts('test', 'test', false);
  });

  it('should call updateSelectedLangs and update for filter', function() {
    ctrlDash.languageList = [
      {
        value: 'test',
        isSelected: false
      },
      {
        value: 'test',
        isSelected: true
      }
    ];

    ctrlDash.updateSelectedLangs(false);
  });

  it('should call updateSelectedLangs to clear all selections', function() {
    ctrlDash.languageList = [
      {
        value: 'test',
        isSelected: false
      },
      {
        value: 'test',
        isSelected: true
      }
    ];
    ctrlDash.selectedLangs = ['en', 'de'];

    ctrlDash.updateSelectedLangs(true);

    expect(ctrlDash.selectedLangs.length).toEqual(0);
  });

  it('should call updateSearch and update search vars', function() {
    ctrlDash.updateSearch('test');
    expect(ctrlDash.searchQuery).toEqual('test');
  });

  it('should test the search filter', function() {
    var testProduct = {
      searchTerms: 'Test Product 1 john doe joedoe@us.ibm.com '
    };

    var validSearchQueryList = [
      'Test Product 1',              //OfferingName
      'john',              //fName
      'Doe',               //lName
      'joedoe@us.ibm.com'                //email
    ];

    // Valid Queries
    for (var index in validSearchQueryList) {
      ctrlDash.searchQuery = validSearchQueryList[index];
      expect(ctrlDash.searchProduct(testProduct)).toBeTruthy();
    }
    // Invalid query
    ctrlDash.searchQuery = 'not in product';
    expect(ctrlDash.searchProduct(testProduct)).toBeFalsy();

    // Empty query
    ctrlDash.searchQuery = '';
    expect(ctrlDash.searchProduct(testProduct)).toBeTruthy();
  });

  it('should test the country filter', function() {
    var testProduct = {
      wcm : {
        locales : [
          'en-us',
          'es-la',
          'fr-fr'
        ]
      }
    };

    // Empty filter, return true
    ctrlDash.countrySelected = {
      code : ''
    };
    expect(ctrlDash.countryFilter(testProduct)).toBeTruthy();

    // Contains data
    ctrlDash.countrySelected = {
      code : 'fr'
    };
    expect(ctrlDash.countryFilter(testProduct)).toBeTruthy();

    // Does not contain data
    ctrlDash.countrySelected = {
      code : 'oo'
    };
    expect(ctrlDash.countryFilter(testProduct)).toBeFalsy();

  });

  it('should test the language filter', function() {
    var testProduct = {
      wcm : {
        locales : [
          'en-us',
          'es-la',
          'fr-fr',
          'fr-ca',
          'zh-cn',
          'zh-tw'
        ]
      }
    };
    // Empty filter, return true
    ctrlDash.selectedLangs = [];
    expect(ctrlDash.languageFilter(testProduct)).toBeTruthy();

    // Contains english - return true
    ctrlDash.selectedLangs = [
      {value : 'en'}
    ];
    expect(ctrlDash.languageFilter(testProduct)).toBeTruthy();

    // Contains at least one valid data in array of standard languages
    ctrlDash.selectedLangs = [
      {value : 'fr'}
    ];
    expect(ctrlDash.languageFilter(testProduct)).toBeTruthy();

    // Contains Spanish (Latin America)
    ctrlDash.selectedLangs = [
      {value : 'es-la'}
    ];
    expect(ctrlDash.languageFilter(testProduct)).toBeTruthy();

    // Contains French (Canada)
    ctrlDash.selectedLangs = [
      {value : 'fr-ca'}
    ];
    expect(ctrlDash.languageFilter(testProduct)).toBeTruthy();

    // Contains Chinese (Traditional)
    ctrlDash.selectedLangs = [
      {value : 'zh-cn'}
    ];
    expect(ctrlDash.languageFilter(testProduct)).toBeTruthy();

    // Contains Chinese (Traditional)
    ctrlDash.selectedLangs = [
      {value : 'zh-tw'}
    ];
    expect(ctrlDash.languageFilter(testProduct)).toBeTruthy();

    // Invalid Data
    ctrlDash.selectedLangs = [
      {value : 'bad-data'}
    ];
    expect(ctrlDash.languageFilter(testProduct)).toBeFalsy();

  });

  it('should test the language filter', function() {
    var testProduct = {
      countryMktConfig : {
        'AT' : {
          globalizationMgr : {
            blacklisted : true,
            reason: '0'
          },
          offeringMgr : {
            blacklisted : true,
            reason: '0'
          }
        },
        'BB' : {
          globalizationMgr : {
            blacklisted : false,
            reason: '0'
          },
          offeringMgr : {
            blacklisted : true,
            reason: '0'
          }
        },
        'CC' : {
          globalizationMgr : {
            blacklisted : true,
            reason: 'RGM1'
          },
          offeringMgr : {
            blacklisted : true,
            reason: 'ROM1'
          }
        }
      }
    };

    // Empty filter, return true
    ctrlDash.statusSelected = '';
    expect(ctrlDash.statusFilter(testProduct)).toBeTruthy();

    // Check 'Awaiting Review by Country Manager' statusFilter
    ctrlDash.statusSelected = 'Awaiting Review by Country Manager';
    expect(ctrlDash.statusFilter(testProduct)).toBeTruthy();

    // Check 'Awaiting Review by Country Manager' statusFilter
    ctrlDash.statusSelected = 'Approved by Country Manager';
    expect(ctrlDash.statusFilter(testProduct)).toBeTruthy();

    // Check 'Blacklisted by Country Manager' statusFilter
    ctrlDash.statusSelected = 'Blacklisted by Country Manager';
    ctrlDash.reasonSelected = {
      value : ''
    };
    expect(ctrlDash.statusFilter(testProduct)).toBeTruthy();

    // Check 'Blacklisted by Offering Provider' statusFilter
    ctrlDash.statusSelected = 'Blacklisted by Offering Provider';
    ctrlDash.reasonSelected = {
      value : ''
    };
    expect(ctrlDash.statusFilter(testProduct)).toBeTruthy();

    // Check 'Blacklisted by Country Manager' statusFilter with sub-reason
    ctrlDash.statusSelected = 'Blacklisted by Country Manager';
    ctrlDash.reasonSelected = {
      value : 'RGM1'
    };
    expect(ctrlDash.statusFilter(testProduct)).toBeTruthy();

    // Check 'Blacklisted by Offering Provider' statusFilter with sub-reason
    ctrlDash.statusSelected = 'Blacklisted by Offering Provider';
    ctrlDash.reasonSelected = {
      value : 'ROM1'
    };
    expect(ctrlDash.statusFilter(testProduct)).toBeTruthy();

    // Check invalid data
    ctrlDash.statusSelected = 'Blacklisted by Offering Provider';
    ctrlDash.reasonSelected = 'ROM5';
    expect(ctrlDash.statusFilter(testProduct)).toBeFalsy();
  }); */

});
