//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('review.cmm').filter('groupBy', groupBy);

  function groupBy() {
    return function groupByFilterReturnFunction (array, field) {
      var groups = {};
      array.forEach(function(objToGroup) {
        var key = objToGroup[field];
        groups[key] = groups[key] || [];
        groups[key].push(objToGroup);
      });
      return Object.keys(groups).map(function(key) {
        return {label: key, group: groups[key]};
      });
    };
  }
})();
