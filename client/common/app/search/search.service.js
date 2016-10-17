//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.search').factory('searchProducts', ['$q', '$http', searchProducts]);

  function searchProducts($q, $http) {
    var cancel = $q.defer();

    var service = {
      query: query,
      get: get
    };

    function query(searchTerm, limit, productType, learningLabType) {
      cancel.resolve();
      cancel = $q.defer();

      return $http({
        method: 'GET',
        url: 'api/diver/queryProducts',
        params: {
          q: searchTerm,
          limit: limit,
          productType: productType,
          learningLabType: learningLabType
        },
        timeout: cancel.promise
      })
        .then(function resolveSearch(response) {
          if (response.data && response.data.results.items.length > 0) {
            return response.data.results.items.map(function(item) {return item.doc;});
          }

          return [];
        });
    }

    function get(productKey) {
      return $http({
        method: 'GET',
        url: 'api/diver/queryProductKey',
        params: {
          key: productKey
        }
      })
        .then(function resolveProduct(response) {
          if (response.data && response.data.results &&
            response.data.results.items &&
            response.data.results.items.length > 0) {
            return response.data.results.items[0].doc;
          }

          return undefined;
        });
    }

    return service;
  }
})();
