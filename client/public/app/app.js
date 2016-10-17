//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('public',
    [
      'ngRoute',
      'ngAria',
      'public.sorry',
      'public.landing'
    ]
  ).config(configuration);

  function configuration($routeProvider, $locationProvider, $ariaProvider) {
    $routeProvider.otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);

    $ariaProvider.config({
      ariaValue: true,
      tabindex: false
    });
  }

})();
