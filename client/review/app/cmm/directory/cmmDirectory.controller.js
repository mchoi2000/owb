//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('review.cmmDir').controller('CMMDirectory',
    ['$q',
    '$anchorScroll',
    '$timeout',
    '$window',
    '$rootScope',
    'BlackListCountriesService',
    'UserService',
    controller]);

  /*jshint maxstatements: 100 */
  function controller($q,
    $anchorScroll,
    $timeout,
    $window,
    $rootScope,
    BlackListCountriesService,
    UserService) {
    /* jshint validthis: true */
    var _this = this;
    var endOfProducts = false;
    _this.loadingPage = true;
    _this.localeList = [];
    _this.sortOption = 'country';
    _this.sortField = false;
    _this.currentUser = {};
    _this.selectedIndex = '';
    _this.disclosureHidden = true;

    //Build a {locale: number-of-languages} map to determine the displayname
    function buildLocaleLanguageMap() {
      _this.localeLanguageMap = {};
      _this.localeList.forEach(function(obj) {
        if (_this.localeLanguageMap[obj.country]) {
          _this.localeLanguageMap[obj.country]++;
        } else {
          _this.localeLanguageMap[obj.country] = 1;
        }
      });
    }

    //If more than one language is supprted, display in the form country(language)
    //else display only the country
    function getUserLocales() {
      _this.userLocales = {};
      if (_this.currentUser.locales) {
        _this.currentUser.locales.forEach(function(userLocale) {
          _this.localeList.forEach(function(locale) {
            if (userLocale.locale === locale.locale) {
              if (_this.localeLanguageMap[locale.country] > 1) {
                _this.userLocales[userLocale.locale] = locale.country +
                                                       ' (' + locale.language + ')';
              } else {
                _this.userLocales[userLocale.locale] = locale.country;
              }
            }
          });
        });
      }
    }

    _this.changeSortOption = changeSortOption;
    function changeSortOption(sortValue) {
      _this.sortOption = sortValue;
      _this.sortField = !_this.sortField;
      _this.selectedIndex = '';
    }

    _this.joinLocale = joinLocale;
    function joinLocale(locale, role) {
      _this.loadingPage = true;
      var newLocaleArray = _this.currentUser.locales ?
                           _this.currentUser.locales.concat({locale: locale, roles: [role]}) :
                           [{locale: locale, roles: [role]}];
      UserService.joinLocale(newLocaleArray)
      .then(function reloadData(data) {
        _this.currentUser.locales = data.config.data;
        getUserLocales();
        _this.loadingPage = false;
      });
    }

    _this.alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                       'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    _this.scrollToCountry = scrollToCountry;
    function scrollToCountry(alphabet) {
      _this.selectedIndex = alphabet;
      if (_this.sortOption !== 'country') {
        _this.sortOption = 'country';
        _this.sortField = false;
      }
      var startIndex = 0;
      var endIndex = _this.localeList.length - 1;
      var direction = 1;
      if (_this.sortField) {
        startIndex = _this.localeList.length - 1;
        endIndex = 0;
        direction = -1;
      }
      while (startIndex !== endIndex) {
        if (_this.localeList[startIndex].country.charAt(0) === alphabet) {
          $anchorScroll.yOffset = 96;
          $anchorScroll(_this.localeList[startIndex].country);
          $timeout(function() {
            // Apply second scroll to allow DOM changes
            $anchorScroll(_this.localeList[startIndex].country);
          });
          break;
        }
        startIndex = startIndex + direction;
      }
    }

    _this.initializeStickyService = initializeStickyService;
    function initializeStickyService() {
      var rightElem = angular.element(document.querySelector('.directory-right-side-header'));
      var tableElem = angular.element(document.querySelector('.locale-list-section'));
      var rightNavOffset = rightElem.offset().top - 51;
      var localeTableOffset = tableElem.offset().top - 51;
      $window.addEventListener('scroll', function() {
        var topDisclosureOffset = _this.disclosureHidden ? 0 : 102;
        if ($window.pageYOffset >= rightNavOffset) {
          _this.fixRightNav = true;
          $rootScope.$apply();
        } else {
          _this.fixRightNav = false;
          $rootScope.$apply();
        }
        if ($window.pageYOffset >= (localeTableOffset + topDisclosureOffset)) {
          _this.fixTableContent = true;
          $rootScope.$apply();
        } else {
          _this.fixTableContent = false;
          $rootScope.$apply();
        }
      });
    }

    _this.initialize = initialize;
    function initialize() {
      var getLocalePromise = BlackListCountriesService.getLocales();
      var getUserInfoPromise = UserService.get();
      var promiseChain = [getLocalePromise, getUserInfoPromise];
      initializeStickyService();
      $q.all(promiseChain).then(function promisesResolved(results) {
        _this.loadingPage = false;
        _this.localeList = results[0];
        _this.currentUser = results[1];

        buildLocaleLanguageMap();
        getUserLocales();

        if (_this.currentUser.settings.initialCmmVisit === 0) {
          _this.disclosureHidden = false;
          _this.currentUser.settings.initialCmmVisit++;
          var updateUserSettings = {
            _id: _this.currentUser._id,
            settings: _this.currentUser.settings
          };
          UserService.updateUser(updateUserSettings);
        }
      });
    }

    _this.initialize();
  }
})();
