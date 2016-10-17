//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('review.offering', ['common.data']);

  angular.module('review.offering').directive('pwbOfferingReview', [offering]);

  function offering() {
    return {
      restrict: 'E',
      scope: {
        content: '=',
        qualificationData: '=',
        relatedProducts: '=?',
        blacklisted: '=',
        sectionsCollapse: '='
      },
      templateUrl: 'review/app/offering/offeringReview.html'
    };
  }
})();
