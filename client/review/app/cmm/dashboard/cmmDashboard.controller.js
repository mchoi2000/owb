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
    '$window',
    'UserService',
    'SevenSeas',
    'CountryMap',
    'languages',
    cmmDashController
  ]);

  function cmmDashController($q, $routeParams, $http, $window, UserService,
                            SevenSeas, CountryMap, languages) {
    /* jshint validthis: true */
    var _this = this;

    _this.countryCode = $routeParams.locale.split('-')[1].toUpperCase();
    _this.locale = $routeParams.locale.toLowerCase();
    _this.loading = true;
    _this.offerings = [];
    _this.userDetails = {};
    _this.showAll = false;
    _this.filterByReview = false;
    _this.filterByBlacklist = false;
    _this.search = {
      offeringName: ''
    };

    _this.openReviewPage = openReviewPage;
    function openReviewPage(link) {
      $window.location.href = 'review/cmm';
    }

    _this.joinLocale = joinLocale;
    function joinLocale() {
      _this.loading = true;
      var newLocaleArray = _this.userDetails.locales ?
                           _this.userDetails.locales
                           .concat({locale: _this.locale, roles: ['editor']}) :
                           [{locale: _this.locale, roles: ['editor']}];
      UserService.joinLocale(newLocaleArray)
      .then(function reloadData(data) {
        _this.userDetails.locales = data.config.data;
        _this.joined = true;
        _this.loading = false;
      });
    }

    function checkIfJoined() {
      if (_this.userDetails.locales) {
        _this.userDetails.locales.forEach(function userLocale(joinedLocale) {
          _this.joined = (joinedLocale.locale === _this.locale);
          return;
        });
      }
    }

    _this.initialize = initialize;
    function initialize() {
      //get base language for the given locale
      _this.baseLanguageCode = SevenSeas.viewMap[SevenSeas.viewMap[SevenSeas.localeMap[_this.locale]
                          .primaryView].parentView].language;
      _this.countryDisplayVal = CountryMap[_this.countryCode];
      languages.forEach(function(obj) {
        if (obj.value === _this.baseLanguageCode) {
          _this.languageDisplayVal = obj.display;
          return;
        }
      });
      //get all offering translated in the given base language from PWB
      var getOfferingsPromise = $http.get('api/locales/getOfferingsByLanguage/' +
                                _this.baseLanguageCode);
      var getUserPromise = UserService.get();

      $q.all([getOfferingsPromise, getUserPromise])
      .then(function promiseChainSuccess(results) {
        _this.loading = false;
        _this.offerings = results[0].data.docs;
        _this.userDetails = results[1];

        checkIfJoined();
      });
    }

    _this.initialize();
  }
})();
