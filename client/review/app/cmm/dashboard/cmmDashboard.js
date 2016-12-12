//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('review.cmmDashboard', [
    'ngRoute',
    'ngCookies',
    'ui.bootstrap',
    'common.title',
    'common.header',
    'common.user',
    'common.data'
  ]).config(configuration);

  function configuration($routeProvider) {
    $routeProvider.when('/review/cmm/dashboard/:locale', {
      templateUrl: 'review/app/cmm/dashboard/cmmDashboard.html',
      controller: 'CMMDashboardController',
      controllerAs: 'ctrlCMMDash',
      pageTitle: 'Globalization Workbench',
      pageSlug: 'cmm-directory'
    });
  }
})();
