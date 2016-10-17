//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.review').directive('pwbReviewSectionHeader', [header]);

  function header() {
    return {
      templateUrl: 'common/app/review/sectionHeader.html',
      restrict: 'E'
    };
  }
})();
