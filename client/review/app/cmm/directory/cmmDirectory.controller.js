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
    '$filter',
    '$http',
    '$cookies',
    'BlackListCountriesService',
    'UserService',
    controller]);

  /*jshint maxstatements: 100 */
  function controller($q,
    $filter,
    $http,
    $cookies,
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

    _this.initialize = initialize;
    function initialize() {
      var getLocalePromise = BlackListCountriesService.getLocales();
      var getUserInfoPromise = UserService.get();
      var promiseChain = [getLocalePromise, getUserInfoPromise];
      $q.all(promiseChain).then(function promisesResolved(results) {
        _this.loadingPage = false;
        _this.localeList = results[0];
        _this.currentUser = results[1];

        buildLocaleLanguageMap();
        getUserLocales();
      });
    }

    _this.initialize();
  }
})();
