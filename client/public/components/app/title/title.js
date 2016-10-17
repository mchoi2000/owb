//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.title', []).directive('pageTitle', [pageTitleDirective]);

  function pageTitleDirective() {
    return {
      restrict: 'A',
      controller: 'PageTitleController',
      controllerAs: 'pageTitleCtrl',
      templateUrl: 'components/app/title/title.html'
    };

  }

})();
