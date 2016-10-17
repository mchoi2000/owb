//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.nav').component('pwbNavbar', {
    templateUrl: 'common/app/nav/navbar.html',
    bindings: {
      navService: '='
    },
    transclude: true
  });
})();
