//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  // Container component for the tasks (lower portion of tile)
  angular.module('common.dashboard').component('pwbDashboardContainer', {
    templateUrl: 'common/app/dashboard/container/container.html',
    transclude: true,
    bindings: {
      status: '@?',
      goLiveDate: '@?'
    }
  });

})();
