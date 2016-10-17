//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.review').directive('pwbReviewSection', [section]);

  function section() {
    return {
      templateUrl: 'common/app/review/section.html',
      transclude: true,
      restrict: 'E',
      scope: {
        name: '@',
        label: '@',
        message: '@',
        isCollapsed: '='
      }
    };
  }
})();
