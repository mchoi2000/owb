//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('review.offering').component('pwbCommerceTable', {
    controller: ['$scope', 'CommerceData', function($scope, CommerceData) {
      var self = this;

      $scope.$watch(function() {return self.plans;}, function() {
        if (self.plans) {
          var maxDetailsLength = Math.max.apply(null, self.plans.map(
            function eachEdition(edition) {
              return edition.planDetails.length;
            })
          );
          self.maxDetails = Array.apply(null, new Array(maxDetailsLength));
          self.maxDetails = self.maxDetails.map(function(item, index) { return index; });
        }
      });

      self.typeMap = CommerceData.reviewTypeMap;
    }],
    templateUrl: 'review/app/offering/commerceTable.html',
    bindings: {
      plans: '<'
    }
  });
})();
