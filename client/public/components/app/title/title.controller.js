//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.title').controller('PageTitleController',
    ['$route', '$rootScope', pageTitleCtrl]);

  function pageTitleCtrl($route, $rootScope) {
    /* jshint validthis: true */
    var self = this;

    activate();
    function activate() {
      self.pageTitle = 'Operator Workbench';

      $rootScope.$on('$routeChangeSuccess', function rootScopeOnCallback() {
        $rootScope.selectedProductTitle = '';
        self.pageTitle = $route.current.pageTitle;
      });
    }
  }
})();
