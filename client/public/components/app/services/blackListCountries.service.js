//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.countries', [])
    .factory('BlackListCountriesService', ['$http', BlackListCountriesService]);

  function BlackListCountriesService($http) {
    var blackListCountriesService = {
      getCountryNames: getCountryNames,
      getCountries: getCountries,
      getAllCountries: getAllCountries
    };

    // Gets a clone of the Blacklist country data.
    function getCountryNames() {
      return $http.get('api/data/blacklistCountries/getAllCountryNames');
    }

    function getCountries() {
      return $http.get('api/data/blacklistCountries/getCountries');
    }

    function getAllCountries() {
      return $http.get('api/data/blacklistCountries/getAllCountries');
    }

    return blackListCountriesService;
  }
})();
