//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('review.cmmDash', [
    'ngRoute',
    'ngCookies',
    'common.title',
    'common.header',
    'common.product',
    'common.data',
    'common.scroller'
  ]).config(configuration);

  function configuration($routeProvider) {
    $routeProvider.when('/review/cmm', {
      templateUrl: 'review/app/cmm/dashboard/cmmDashboard.html',
      controller: 'CMMDashboard',
      controllerAs: 'ctrlCMM',
      pageTitle: 'Globalization Workbench CMM Review Dashboard',
      pageSlug: 'cmm-dashboard'
    })
    ;
  }
})();
