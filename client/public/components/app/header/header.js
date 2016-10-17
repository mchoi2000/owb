//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.header', [
    'ngRoute',
    'feature-flags',
    'common.user'
  ]).directive('header', [headerDirective]);

  function headerDirective() {
    return {
      restrict: 'A',
      controller: 'HeaderController',
      controllerAs: 'headerCtrl',
      templateUrl: 'components/app/header/header.html'
    };
  }
})();
