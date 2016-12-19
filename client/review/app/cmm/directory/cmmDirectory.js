//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('review.cmmDirectory', [
    'ngRoute',
    'ngCookies',
    'ui.bootstrap',
    'common.title',
    'common.header',
    'common.user',
    'common.data',
    'common.scroller',
    'common.countries'
  ]).config(configuration);

  function configuration($routeProvider) {
    $routeProvider.when('/review/cmm', {
      templateUrl: 'review/app/cmm/directory/cmmDirectory.html',
      controller: 'CMMDirectoryController',
      controllerAs: 'ctrlCMMDir',
      pageTitle: 'Globalization Workbench CMM Review Directory',
      pageSlug: 'cmm-directory'
    })
    ;
  }
})();
