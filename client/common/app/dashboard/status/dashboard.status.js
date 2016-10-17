//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  // Dashboard status component (upper portion of tile)
  angular.module('common.dashboard').component('pwbDashboardStatus', {
    templateUrl: 'common/app/dashboard/status/dashboard.status.html',
    controller: DashboardStatusController,
    bindings: {
      limit: '<',
      offeringName: '@',
      status: '@?',
      liveUrl: '@?',
      offeringId: '@?',
      onPublish: '&?'
    }
  });

  function DashboardStatusController() {
    var self = this;
    self.publish = function publish(id) {
      self.onPublish({id: id});
    };
  }

})();
