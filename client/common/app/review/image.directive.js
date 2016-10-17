//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.review').directive('pwbReviewImage', [image]);

  function image() {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        value: '=',
        href: '=?'
      },
      templateUrl: 'common/app/review/image.html',
      require: '?^^pwbReviewGroup',
      link: function(scope, iElement, iAttrs, groupCtrl) {
        if (!scope.href) {
          if (!scope.value) {
            var endWatch = scope.$watch('value', function(newValue) {
              if (newValue) {
                scope.href = newValue;
                endWatch();
              }
            });
          } else {
            scope.href = scope.value;
          }
        }

        scope.inGroup = groupCtrl !== null;

        if (iAttrs.hasOwnProperty('groupLabel')) {
          scope.groupLabel = groupCtrl.groupLabel;
        }
      }
    };
  }
})();
