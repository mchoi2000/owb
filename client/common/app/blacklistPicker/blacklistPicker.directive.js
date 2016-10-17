//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.blacklistPicker',['common.countries', 'common.data']);

  angular.module('common.blacklistPicker').directive('pwbBlacklistPicker',
    ['BlackListCountriesService', 'omBlacklistReasons', '$timeout', blacklistPickerDirective]);

  function blacklistPickerDirective(BlackListCountriesService, omBlacklistReasons, $timeout) {
    return {
      restrict: 'E',
      require: ['^form'],
      scope: {
        marketConfig: '=',
        id: '@',
        name: '@'
      },
      templateUrl: 'common/app/blacklistPicker/blacklistPicker.html',
      priority: 100,
      link: function(scope, elm, attrs, ctrl) {
        scope.whitelist = [];
        scope.blacklist = [];

        BlackListCountriesService.getCountries()
          .then(function buildCountryData(response) {
            var countries = response.data;
            scope.countriesDisplay = {};
            countries.forEach(function buildCountryDisplay(country) {
              scope.countriesDisplay[country.code] = country.name;
            });
            updateList();
          });

        function updateList() {
          for (var countryCode in scope.marketConfig) {
            if (scope.marketConfig[countryCode].offeringMgr.blacklisted) {
              scope.blacklist
                .push({value: countryCode, display: scope.countriesDisplay[countryCode]});
            } else {
              scope.whitelist
                .push({value: countryCode, display: scope.countriesDisplay[countryCode]});
            }
          }
          scope.blacklist = scope.blacklist.sort(compareDisplay);
          scope.whitelist = scope.whitelist.sort(compareDisplay);
        }

        function compareDisplay(country1, country2) {
          if (country1.display > country2.display) {
            return 1;
          }
          if (country1.display < country2.display) {
            return -1;
          }
          return 0;
        }

        function addCountryToBlacklist(countryCode) {
          scope.blacklist
            .splice(locationToModify(scope.blacklist,
                            {display: scope.countriesDisplay[countryCode]}, compareDisplay),
                            0, {value: countryCode, display: scope.countriesDisplay[countryCode]});
        }

        function addCountryToWhitelist(countryCode) {
          scope.whitelist
            .splice(locationToModify(scope.whitelist,
                             {display: scope.countriesDisplay[countryCode]}, compareDisplay),
                             0, {value: countryCode, display: scope.countriesDisplay[countryCode]});
        }

        function removeCountryFromWhitelist(display) {
          scope.whitelist.splice(locationToModify(scope.whitelist,
            {display: display}, compareDisplay, 'delete'), 1);
        }

        function removeCountryFromBlacklist(display) {
          scope.blacklist.splice(locationToModify(scope.blacklist,
            {display: display}, compareDisplay, 'delete'), 1);
        }

        var x, y;
        //Bind the parent form to the scope
        scope.form = ctrl[0];

        scope.toolTipElement = elm.find('#full-country-long-name-tooltip')[0];
        scope.fullCountryNameTooltip = '';
        scope.maxCountryDisplayLength = 33;

        scope.fullCountryNameMouseMove = function(event) {
          if (scope.fullCountryNameTooltip !== '') {
            x = event.clientX;
            y = event.clientY;

            scope.toolTipElement.style.top = (y - 38) + 'px';
            scope.toolTipElement.style.left = (x - 105) + 'px';
          }
        };

        scope.fullCountryNameMouseOver = function(event) {
          scope.fullCountryNameTooltip = event.target.value;
          if (scope.fullCountryNameTooltip.length <= scope.maxCountryDisplayLength) {
            scope.fullCountryNameTooltip = '';
          }
          $timeout(function timeoutCallback() {
            scope.$apply();
          }, 0);
        };

        scope.fullCountryNameMouseOut = function(event) {
          scope.fullCountryNameTooltip = '';
          $timeout(function timeoutCallback() {
            scope.$apply();
          }, 0);
        };

        scope.blackListReasons = omBlacklistReasons;
        scope.reasonsDisplay = {};
        omBlacklistReasons.forEach(function(reason) {
          scope.reasonsDisplay[reason.value] = reason.display;
        });

        scope.selectedWhitelist = [];
        scope.selectedBlacklist = [];
        scope.showMovingAnimation = false;
        scope.singleReasonForAllBlacklist = '';
        scope.showIndividualReasons = false;
        scope.addReasonsManually = false;
        scope.singleReasonFocus = false;
        scope.atleastOneReasonSelected = false;

        scope.$watch('marketConfig', function(value) {
          var allSameReasons = false;
          if (value) {
            var blacklist = Object.keys(value).filter(function getBlacklist(key) {
              return value[key].offeringMgr.blacklisted;
            });
            if (blacklist.length > 0) {
              scope.singleReasonForAllBlacklist = value[blacklist[0]].offeringMgr.reason;
              allSameReasons = blacklist.reduce(function (prev, current) {
                                    if (prev) {
                                      return prev ===
                                             value[current].offeringMgr.reason ?
                                      prev : false;
                                    } else {
                                      return false;
                                    }
                                  }, value[blacklist[0]].offeringMgr.reason) ===
                                    value[blacklist[0]].offeringMgr.reason;
              if (allSameReasons) {
                scope.showIndividualReasons = false;
                scope.addReasonsManually = false;
              } else {
                scope.showIndividualReasons = true;
                scope.addReasonsManually = true;
                scope.singleReasonForAllBlacklist = '';
              }
            }
          }
        });

        scope.$watch('blackListReasonsForm.$valid', function() {
          var elemName = scope.name;
          scope.form.$setValidity(elemName, scope.blackListReasonsForm.$valid);
        });

        scope.addToBlacklist = function(moveAll) {
          scope.showMovingAnimation = true;
          scope.selectedBlacklist = [];
          if (moveAll) {

            scope.whitelist = [];
            scope.blacklist = [];
            for (var countryCode in scope.marketConfig) {
              scope.marketConfig[countryCode].offeringMgr.blacklisted = true;
            }
            scope.showMovingAnimation = false;
            updateList();
          } else {
            for (var i = 0; i < scope.selectedWhitelist.length; i++) {
              scope.marketConfig[scope.selectedWhitelist[i]].offeringMgr.blacklisted = true;
              removeCountryFromWhitelist(scope.countriesDisplay[scope.selectedWhitelist[i]]);
              addCountryToBlacklist(scope.selectedWhitelist[i]);
            }
            scope.showMovingAnimation = false;
            scope.selectedWhitelist = [];
          }

          scope.singleReasonForAllBlacklist = '';
          scope.data = scope.blacklist;
          scope.selectedWhitelist = [];
        };

        scope.removeFromBlacklist = function (moveAll) {
          scope.showMovingAnimation = true;
          if (moveAll) {
            scope.whitelist = [];
            scope.blacklist = [];
            for (var countryCode in scope.marketConfig) {
              scope.marketConfig[countryCode].offeringMgr.blacklisted = false;
              scope.marketConfig[countryCode].offeringMgr.reason = undefined;
            }
            scope.showMovingAnimation = false;
            updateList();
          } else {
            for (var i = 0; i < scope.selectedBlacklist.length; i++) {
              scope.marketConfig[scope.selectedBlacklist[i]].offeringMgr.blacklisted = false;
              removeCountryFromBlacklist(scope.countriesDisplay[scope.selectedBlacklist[i]]);
              addCountryToWhitelist(scope.selectedBlacklist[i]);
            }

            scope.showMovingAnimation = false;
            scope.selectedBlacklist = [];
          }
        };
        /*jshint maxcomplexity:12 */
        function locationToModify(arr, key, comparator, operation, startIndex, endIndex) {
          startIndex = startIndex === undefined ?  0 : startIndex;
          endIndex = endIndex === undefined ? (arr.length - 1) : endIndex;
          if (startIndex < endIndex) {
            var middleIndex = Math.floor(startIndex + (endIndex - startIndex) / 2);
            var comapre = comparator(arr[middleIndex], key);
            if (comapre > 0) {
              return locationToModify(arr, key, comparator, operation, startIndex, middleIndex);
            } else if (comapre < 0) {
              return locationToModify(arr, key, comparator, operation, middleIndex + 1, endIndex);
            } else {
              //Insert at location
              return middleIndex;
            }
          } else if (startIndex === arr.length - 1) {
            if (comparator(arr[startIndex], key) > 0) {
              //Insert at last index
              return startIndex;
            } else {
              //Key greater than all elements
              if (operation === 'delete') {
                return arr.length - 1;
              } else {
                return arr.length;
              }
            }
          } else {
            //Insert at the begining
            return startIndex;
          }
        }

        scope.clearAllBlacklistReasons = function () {
          for (var i = 0; i < scope.blacklist.length; i++) {
            scope.marketConfig[scope.blacklist[i].value].offeringMgr.reason = '';
          }
          scope.singleReasonForAllBlacklist = '';

          scope.showMovingAnimation = false;
        };

        scope.updateBlackListReason = function (country, reason, individualReasonsActive) {
          // Manually add different reasons for each country
          if (country !== 'singleReasonForAllCountries') {
            scope.marketConfig[country.value].offeringMgr.reason = reason;
            scope.singleReasonForAllBlacklist = '';
          }
          // Use the same reason for all countries
          else {
            scope.singleReasonForAllBlacklist = reason;

            for (var i = 0; i < scope.blacklist.length; i++) {
              scope.marketConfig[scope.blacklist[i].value].offeringMgr.reason = reason;
            }
            if (individualReasonsActive) {
              scope.singleReasonForAllBlacklist = '';
            }
          }
          scope.atleastOneReasonSelected = true;
          scope.showMovingAnimation = false;

        };

        scope.updateReasons = function(reason) {
          scope.singleReasonForAllBlacklist = reason;
          scope.singleReasonFocus = true;
        };
      }
    };
  }
})();
