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
      getLocales: getLocales
    };

    function getLocales() {
      return $http.get('api/locales')
        .then(function getLocale(locales) {
          return locales.data.map(function(obj) {
            return {
              locale: obj.locale,
              country: obj.name.split('-')[0].trim(),
              language: obj.name.split('-')[1].trim()
            };
          });
        });
    }
    return blackListCountriesService;
  }
})();
