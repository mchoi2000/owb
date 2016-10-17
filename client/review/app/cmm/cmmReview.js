//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('review.cmm', [
    'ngRoute',
    'ui.bootstrap',
    'common.title',
    'common.header',
    'common.product',
    'common.search',
    'common.review',
    'common.countries',
    'common.arrayHelper',
    'common.input',
    'common.data',
    'common.user',
    'review.offering',
    'common.languageDisplayName'
  ]).config(configuration);

  function configuration($routeProvider) {
    $routeProvider.when('/review/cmm/:id', {
      templateUrl: 'review/app/cmm/cmmReview.html',
      controller: 'ctrlCMMReviewForm',
      controllerAs: 'ctrlCMM',
      pageTitle: 'Provider Workbench CMM Review Page',
      pageSlug: 'cmm-review'
    });
  }
})();
