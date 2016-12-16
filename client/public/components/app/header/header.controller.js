//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.header').controller('HeaderController', [
    'UserService',
    'BlackListCountriesService',
    '$q',
    '$route',
    '$location',
    headerCtrl
  ]);

  function headerCtrl(UserService, BlackListCountriesService, $q, $route, $location) {
    /* jshint validthis: true */
    var self = this;
    self.path = $location.path();
    self.localeList = [];

    // Added in to check if $route.current is undefined and on the register page
    // If so, manually set the page values since route.current is breaking in gulp serve:dist
    if ($route.current === undefined && self.path === '/register/register.html') {
      self.pageSlug = 'register';
      self.pageTitle = 'Join the Globalization Workbench';
    } else {
      self.pageSlug = $route.current.pageSlug;
      self.pageTitle = $route.current.pageTitle;
    }

    activate();

    function activate() {
      var getLocalePromise = BlackListCountriesService.getLocales();
      var getUserInfoPromise = UserService.get();
      var promiseChain = [getLocalePromise, getUserInfoPromise];

      $q.all(promiseChain).then(function promisesResolved(results) {
        self.localeList = results[0];
        self.user = results[1];
        buildLocaleLanguageMap();
        getUserLocales();
      });
    }

    //Build a {locale: number-of-languages} map to determine the displayname
    function buildLocaleLanguageMap() {
      self.localeLanguageMap = {};
      self.localeList.forEach(function(obj) {
        if (self.localeLanguageMap[obj.country]) {
          self.localeLanguageMap[obj.country]++;
        } else {
          self.localeLanguageMap[obj.country] = 1;
        }
      });
    }

    //If more than one language is supprted, display in the form country(language)
    //else display only the country
    function getUserLocales() {
      self.userLocales = {};
      if (self.user.locales) {
        self.user.locales.forEach(function(userLocale) {
          self.localeList.forEach(function(locale) {
            if (userLocale.locale === locale.locale) {
              if (self.localeLanguageMap[locale.country] > 1) {
                self.userLocales[userLocale.locale] = locale.country +
                  ' (' + locale.language + ')';
              } else {
                self.userLocales[userLocale.locale] = locale.country;
              }
            }
          });
        });
      }
    }
  }
})();
