//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('public.sorry', [
    'ngRoute',
    'common.title',
    'common.header'
  ]).config(configuration);

  function configuration($routeProvider) {
    $routeProvider.when('/sorryPage', {
      templateUrl: 'app/sorryPage/sorryPage.html',
      pageTitle: 'Sorry Page',
      pageSlug: 'home'
    })
    ;
  }
})();
