//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('review.cmmDir', [
    'ngRoute',
    'ngCookies',
    'common.title',
    'common.header',
    'common.user',
    'common.data',
    'common.scroller'
  ]).config(configuration);

  function configuration($routeProvider) {
    $routeProvider.when('/review/cmm', {
      templateUrl: 'review/app/cmm/directory/cmmDirectory.html',
      controller: 'CMMDirectory',
      controllerAs: 'ctrlCMM',
      pageTitle: 'Globalization Workbench CMM Review Directory',
      pageSlug: 'cmm-directory'
    })
    ;
  }
})();
