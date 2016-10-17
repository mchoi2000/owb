//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

angular.module('common.loading', ['ngRoute', 'common.header']).directive('loadingIndicator', [
  '$rootScope',
  '$route',
  loadingDirective
]);

function loadingDirective($rootScope, $route) {
  return {
    restrict: 'E',
    templateUrl: 'components/app/loading/loadingIndicator.html',
    pageSlug: 'Loading',
    link: function(scope, elem, attrs) {
      $route.current = $route.current || {pageSlug: ''};
      scope.loadingPage = true;
      $rootScope.$on('$routeChangeSuccess', function() {
        scope.loadingPage = false;
      });
    }
  };
}
