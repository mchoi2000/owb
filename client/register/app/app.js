(function() {
  'use strict';

  angular.module('register',[
    'ngRoute',
    'ui.bootstrap',
    'common.title',
    'common.header'
  ]).config(configuration);

  function configuration($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.otherwise({
      controller: 'RegistrationController',
      controllerAs: 'ctrlReg',
      templateUrl: 'register/app/register.html',
      pageTitle: 'Join the Operator Workbench',
      pageSlug: 'register'
    });
  }
})();
