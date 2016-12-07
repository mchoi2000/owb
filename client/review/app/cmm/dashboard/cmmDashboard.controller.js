//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('review.cmmDashboard').controller('CMMDashboardController', [
    '$q',
    '$routeParams',
    '$http',
    'UserService',
    'SevenSeas',
    'CountryMap',
    'languages',
    cmmDashController
  ]);

  function cmmDashController($q, $routeParams, $http, UserService,
                            SevenSeas, CountryMap, languages) {
    var self = this;

    self.baseLanguageCode;
    self.languageDisplayVal;
    self.countryDisplayVal;
    self.countryCode = $routeParams.locale.split('-')[1].toUpperCase();
    self.locale = $routeParams.locale.toLowerCase();
    self.loading = true;
    self.offerings = [];
    self.userDetails = {};

    function initialize() {
      //get base language for the given locale
      self.baseLanguageCode = SevenSeas.viewMap[SevenSeas.viewMap[SevenSeas.localeMap[self.locale]
                          .primaryView].parentView].language;
      self.countryDisplayVal = CountryMap[self.countryCode];
      languages.forEach(function(obj) {
        if (obj.value === self.baseLanguageCode) {
          self.languageDisplayVal = obj.display;
          return;
        }
      });
      //get all offering translated in the given base language from PWB
      var getOfferingsPromise = $http.get('api/locales/getOfferingsByLanguage/' +
                                self.baseLanguageCode);
      var getUserPromise = UserService.get();

      $q.all([getOfferingsPromise, getUserPromise])
      .then(function promiseChainSuccess(results) {
        self.loading = false;
        self.offerings = results[0].docs;
        self.userDetails = results[1];
      });
    }

    initialize();
  }
})();
