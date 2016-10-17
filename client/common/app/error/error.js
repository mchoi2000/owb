//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.error', ['ngRoute', 'ngAnimate', 'toastr'])
    .config(configuration)
    .run(initializeFunction);

  function configuration($routeProvider, toastrConfig) {
    $routeProvider.otherwise({
      controller: 'errorController',
      template: '<div></div>'
    });

    //Extend the toastr config settings
    angular.extend(toastrConfig, {
      timeOut: 25000,
      templates: {
        toast: 'common/app/error/toast.html'
      },
      allowHtml: true,
      tapToDismiss: false,
      extendedTimeOut: 25000
    });

  }

  function initializeFunction($templateCache) {
    $templateCache.put('common/app/error/toast.html',
    '<div class="pwb-toast {{toastClass}} {{toastType}}" ng-click="tapToast()">' +
    '<div ng-switch on="allowHtml" class="pwb-toaster-container">' +
    '<div ng-switch-default ng-if="title" class="{{titleClass}}"' +
    'aria-label="{{title}}">{{title}}</div>' +
    '<div ng-switch-default class="{{messageClass}}" aria-label="{{message}}">{{message}}</div>' +
    '<div ng-switch-when="true" ng-if="title" class="{{titleClass}}" ng-bind-html="title"></div>' +
    '<div ng-switch-when="true" class="{{messageClass}}" ng-bind-html="message"></div>' +
    '</div>' +
    '<div class="pwb-close-button" ng-click="close(true, $event)">' +
    '<span>Send Report</span>' +
    '</div>' +
    '<progress-bar ng-if="progressBar"></progress-bar>' +
    '</div>');
  }

})();
