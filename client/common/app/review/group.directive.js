//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.review').directive('pwbReviewGroup', groupDir);

  function groupDir() {
    return {
      templateUrl: 'common/app/review/group.html',
      transclude: true,
      restrict: 'E',
      scope: {
        label: '@'
      },
      controller: ['$scope', GroupCtrl]
    };
  }

  function GroupCtrl($scope) {
    this.groupLabel = $scope.label;
  }
})();
