//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.dashboard').component('pwbInitialTask', {
      templateUrl: 'common/app/dashboard/initTask/initial.task.html',
      controller: DashboardInitialTaskController,
      bindings: {
        status: '@',
        link: '@',
        publishDate: '@',
        statusDate: '@',
        taskName: '@',
        linkedStatus: '@',
        lastPublishedDate: '@',
        isAcademy: '<?'
      }
    });

  function DashboardInitialTaskController() {
    var self = this;

    self.taskIcon = getTaskIcon(self.status, self.taskName);

    self.iconColor = '';
    getIconColor(self.status);

    function getIconColor(status) {
      if (self.status === 'Returned') {
        self.iconColor = 'red';
      }
      else if (self.status === 'Approved' ||
              self.status === 'Published' ||
              self.status === 'Complete') {
        self.iconColor = 'green';
      }
      else if (self.status === 'Last modified') {
        self.iconColor = 'purple';
      }
    }

    function getTaskIcon(status, taskName) {
      /*jshint maxcomplexity:20 */
      // First check against status for icon
      if (self.status === 'Returned') {
        return 'icon-alert-circle-new';
      }
      else if (self.status === 'Approved' ||
              self.status === 'Published' ||
              self.status.substring(0,17) === 'Will be published' ||
              self.status.substring(0,7) === 'Waiting' ||
              self.status === 'Complete') {
        return 'icon-check-circle-new';
      }
      else if (self.status === 'Submitted' ||
               self.status.substring(0,16) === 'Sent for publish') {
        return 'icon-lock';
      }
      else if (self.status === 'Not required') {
        return 'icon-omitted-circle';
      }
      // If the status is not above, use icon based on task
      else if (self.taskName === 'Commerce Task') {
        return 'icon-shopping-cart';
      }
      else if (self.taskName === 'Integration Task') {
        return 'icon-markup';
      }
      return 'icon-doc';
    }

  }

})();
