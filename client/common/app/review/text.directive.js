//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.review').directive('pwbReviewText', [text]);

  function text() {
    return {
      templateUrl: 'common/app/review/text.html',
      restrict: 'E',
      scope: {
        label: '@',
        value: '='
      },
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
