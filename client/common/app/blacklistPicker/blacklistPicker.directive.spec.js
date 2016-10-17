'use strict';

describe('Blacklist Picker Directive', function() {
  var compile, scope, element, $timeout;
  beforeEach(function() {
    module('common.blacklistPicker',
    'common/app/blacklistPicker/blacklistPicker.html');
    inject(function($injector, BlackListCountriesService,
      $compile, $rootScope, _$timeout_) {
      BlackListCountriesService.getCountries = function() {
        return {
          then: function (callback) {
            return callback({data:[{code: '1', name: 'SavedCountry1'},
                                   {code: '2', name: 'SavedCountry2'},
                                   {code: '3', name: 'SavedCountry3'},
                                   {code: '4', name: 'SavedCountry4'},
                                   {code: '5', name: 'SavedCountry5'},
                                   {code: '6', name: 'SavedCountry6'}
                                 ]});
          }
        };
      };

      var configData = {
        1: {offeringMgr: {blacklisted: false}},
        2: {offeringMgr: {blacklisted: true}},
        3: {offeringMgr: {blacklisted: false}},
        4: {offeringMgr: {blacklisted: true, reason: 'test2'}},
        5: {offeringMgr: {blacklisted: false}},
        6: {offeringMgr: {blacklisted: true, reason: 'test3'}}
      };
      spyOn(BlackListCountriesService, 'getCountries').and.callThrough();

      compile = $compile;
      scope = $rootScope.$new();
      scope.initconfig = configData;
      element = angular.element('<form><pwb-blacklist-picker ' +
      'id="test"' +
      'name="test" market-config="initconfig"' +
      '></pwb-blacklist-picker></form>');

      $timeout = _$timeout_;

      compile(element)(scope);
      scope.$digest();

    });
  });

  it('should watch marketConfig and update if all reasons are same', function() {
    var directiveScope = element.children().isolateScope();
    // same reason test
    directiveScope.marketConfig = {
      1: {offeringMgr: {blacklisted: true, reason: 'test'}},
      2: {offeringMgr: {blacklisted: false}},
      3: {offeringMgr: {blacklisted: true, reason: 'test'}}
    };
    scope.$digest();
    expect(directiveScope.singleReasonForAllBlacklist).toEqual('test');

    // different reason test
    directiveScope.marketConfig = {
      1: {offeringMgr: {blacklisted: true, reason: 'test'}},
      2: {offeringMgr: {blacklisted: false}},
      3: {offeringMgr: {blacklisted: true, reason: 'test2'}}
    };
    scope.$digest();
    expect(directiveScope.singleReasonForAllBlacklist).toEqual('');

    // no blacklist test
    directiveScope.marketConfig = {
      1: {offeringMgr: {blacklisted: false}},
      2: {offeringMgr: {blacklisted: false}}
    };
    scope.$digest();

    // undefined test
    directiveScope.marketConfig = undefined;
    scope.$digest();
  });

  it('should add country to blacklist', function() {
    var directiveScope = element.children().isolateScope();

    directiveScope.selectedWhitelist = ['2'];
    scope.$digest();
    directiveScope.addToBlacklist(false);
    expect(directiveScope.marketConfig['2'].offeringMgr.blacklisted)
      .toEqual(true);
  });

  it('should add country to blacklist - multiple countires', function() {
    var directiveScope = element.children().isolateScope();
    directiveScope.selectedWhitelist = ['3', '5'];
    scope.$digest();
    directiveScope.addToBlacklist(false);
    directiveScope.selectedWhitelist.forEach(function eachCode(code) {
      expect(directiveScope.marketConfig[code].offeringMgr.blacklisted)
        .toEqual(true);
    });
  });

  it('should add all countries to blacklist', function() {
    var directiveScope = element.children().isolateScope();
    scope.$digest();
    directiveScope.addToBlacklist(true);
  });

  it('should remove selected countries from blackist', function() {
    var directiveScope = element.children().isolateScope();
    directiveScope.selectedBlacklist = ['2', '4'];
    scope.$digest();
    directiveScope.removeFromBlacklist(false);
    directiveScope.selectedBlacklist.forEach(function eachCode(code) {
      expect(directiveScope.marketConfig[code].offeringMgr.blacklisted)
        .toEqual(false);
    });
  });

  it('should remove selected countries from blackist -- select all countries', function() {
    var directiveScope = element.children().isolateScope();
    directiveScope.selectedBlacklist = ['2', '4', '6'];
    scope.$digest();
    directiveScope.removeFromBlacklist(false);
    directiveScope.selectedBlacklist.forEach(function eachCode(code) {
      expect(directiveScope.marketConfig[code].offeringMgr.blacklisted)
        .toEqual(false);
    });
  });

  it('should remove all countries from blacklist', function() {
    var directiveScope = element.children().isolateScope();
    scope.$digest();
    directiveScope.removeFromBlacklist(true);
  });

  it('should remove all reasons from blacklist', function() {
    var directiveScope = element.children().isolateScope();
    scope.$digest();
    directiveScope.clearAllBlacklistReasons();
    expect(directiveScope.singleReasonForAllBlacklist).toEqual('');

    directiveScope.blacklist.forEach(function eachBlacklist(country) {
      expect(directiveScope.marketConfig[country.value].offeringMgr.reason).toEqual('');
    });
  });

  it('should update blacklist reason for one country', function() {
    var directiveScope = element.children().isolateScope();
    scope.$digest();
    directiveScope.updateBlackListReason(directiveScope.blacklist[0], 'ROM3', true);
    expect(directiveScope.marketConfig[directiveScope.blacklist[0].value]
        .offeringMgr.reason).toEqual('ROM3');
  });

  it('should update all countries with same reason', function() {
    var directiveScope = element.children().isolateScope();
    scope.$digest();
    directiveScope.updateBlackListReason('singleReasonForAllCountries', 'ROM5', true);
    directiveScope.blacklist.forEach(function eachBlacklist(country) {
      expect(directiveScope.marketConfig[country.value].offeringMgr.reason).toEqual('ROM5');
    });
    expect(directiveScope.singleReasonForAllBlacklist).toEqual('');
  });

  it('should update all countries with same reason and keep the reason', function() {
    var directiveScope = element.children().isolateScope();
    scope.$digest();
    directiveScope.updateBlackListReason('singleReasonForAllCountries', 'ROM5', false);
    directiveScope.blacklist.forEach(function eachBlacklist(country) {
      expect(directiveScope.marketConfig[country.value].offeringMgr.reason).toEqual('ROM5');
    });
  });

  it('should update a single reason when individual reasons are not selected', function() {
    var directiveScope = element.children().isolateScope();
    scope.$digest();
    directiveScope.updateReasons('ROM5');
    expect(directiveScope.singleReasonForAllBlacklist).toEqual('ROM5');
    expect(directiveScope.singleReasonFocus).toBeTruthy();
  });

  it('should run mouse move function on given tooltip name', function() {
    var directiveScope = element.children().isolateScope();

    directiveScope.fullCountryNameTooltip = 'test name';

    var testEvent = {
      'clientX': 100,
      'clientY': 100
    };

    directiveScope.toolTipElement = {
      'style': {
        'top': '30px',
        'left': '20px'
      }
    };

    scope.$digest();
    directiveScope.fullCountryNameMouseMove(testEvent);
  });

  it('should run mouse move function on empty tooltip name', function() {
    var directiveScope = element.children().isolateScope();

    directiveScope.fullCountryNameTooltip = '';

    var testEvent = {
      'clientX': 100,
      'clientY': 100
    };

    directiveScope.toolTipElement = {
      'style': {
        'top': '30px',
        'left': '20px'
      }
    };

    scope.$digest();
    directiveScope.fullCountryNameMouseMove(testEvent);
  });

  it('should run mouse over function on given tooltip name too short', function() {
    var directiveScope = element.children().isolateScope();

    directiveScope.fullCountryNameTooltip = 'test name';
    var testEvent = {
      'clientX': 100,
      'clientY': 100,
      'target': {
        'value': 'test'
      }
    };

    directiveScope.toolTipElement = {
      'style': {
        'top': '30px',
        'left': '20px'
      }
    };

    scope.$digest();
    directiveScope.fullCountryNameMouseOver(testEvent);
    $timeout.flush();

  });

  it('should run mouse over function on given tooltip long name', function() {
    var directiveScope = element.children().isolateScope();

    directiveScope.fullCountryNameTooltip = 'test name';
    var testEvent = {
      'clientX': 100,
      'clientY': 100,
      'target': {
        'value': 'really long test name that will exceed max length for test'
      }
    };

    directiveScope.toolTipElement = {
      'style': {
        'top': '30px',
        'left': '20px'
      }
    };

    scope.$digest();
    directiveScope.fullCountryNameMouseOver(testEvent);
    $timeout.flush();

  });

  it('should run mouse out function on given tooltip name', function() {
    var directiveScope = element.children().isolateScope();

    directiveScope.fullCountryNameTooltip = 'test name';
    var testEvent = {
      'clientX': 100,
      'clientY': 100,
      'target': {
        'value': 'test'
      },
      'length': 100
    };

    directiveScope.toolTipElement = {
      'style': {
        'top': '30px',
        'left': '20px'
      }
    };

    scope.$digest();
    directiveScope.fullCountryNameMouseOut(testEvent);
    $timeout.flush();

  });

});
