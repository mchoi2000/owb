//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.review').directive('pwbReviewList', [list]);

  function list() {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        list: '='
      },
      templateUrl: 'common/app/review/list.html',
      require: '?^^pwbReviewGroup',
      link: function(scope, iElement, iAttrs, groupCtrl) {
        scope.inGroup = groupCtrl !== null;

        if (iAttrs.hasOwnProperty('groupLabel')) {
          scope.groupLabel = groupCtrl.groupLabel;
        }
      }
    };
  }
})();
