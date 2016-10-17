//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.review').directive('pwbReviewSubsection', [subsection]);

  function subsection() {
    return {
      templateUrl: 'common/app/review/subsection.html',
      restrict: 'E',
      scope: {
        label: '@',
        status: '=',
        modifiedBy: '=?',
        at: '=?',
        alertStatus: '=',
        loading: '='
      }
    };
  }
})();
