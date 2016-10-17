//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  // Common PWB Task component which is used to redirect to correct task based on the params
  angular.module('common.dashboard').component('pwbTask', {
    templateUrl: 'common/app/dashboard/commonTask/task.html',
    controller: DashboardCommonTaskController,
    bindings: {
      linkedStatus: '@?',
      link: '@?',
      task: '<',
      taskName: '@',
      isAcademy: '<?',
      offeringStatus: '@'
    }
  });

  function DashboardCommonTaskController($filter) {
    var self = this;
    self.lastPublishedDate = '';

    self.status = '';
    self.statusDate = '';

    if (self.isAcademy === undefined) {
      self.isAcademy = false;
    }

    /*jshint maxcomplexity:50 */
    self.getStatus = function getStatus(task, isAcademy) {
      if (isAcademy === undefined) {
        isAcademy = false;
      }

      // Checks if published in the past but also has updates
      if (task.publishDate !== '0' &&
          task.publishDate !== undefined &&
          task.status !== 'Published' &&
          !isAcademy) {
        self.lastPublishedDate = $filter('date')(task.publishDate, 'MMM. dd, yyyy');
      }

      if (task.status === 'Not Started') {
        return 'Not Started';
      }

      // Academy Modified Task
      else if (task.status === 'Content Modified' && isAcademy) {
        self.statusDate = $filter('date')(task.lastModifiedOn, 'MMM. dd, yyyy');
        return 'Last modified';
      }
      // Academy Modified Task after publish
      else if (task.status === 'Published Update' && isAcademy) {
        self.lastPublishedDate = $filter('date')(task.publishedOn, 'MMM. dd, yyyy');
        self.statusDate = $filter('date')(task.lastModifiedOn, 'MMM. dd, yyyy');
        return 'Last modified';
      }

      // New Conditions - use linkedStatus variable if not empty, return it
      else if (self.linkedStatus !== undefined &&
               self.linkedStatus !== '' &&
               self.taskName === 'Commerce Task') {
        return self.linkedStatus;
      }

      else if (self.taskName === 'Integration Task') {
        return getIntegrationStatus(task);
      }
      else if (task.status === 'Incomplete') {
        self.statusDate = $filter('date')(task.editDate, 'MMM. dd, yyyy');
        return 'Last modified';
      }
      else if (task.status === 'InReview') {
        self.statusDate = $filter('date')(task.submitDate, 'MMM. dd, yyyy');
        return 'Submitted';
      }
      else if (task.status === 'pending_publish') {
        if (task.goLiveDate !== undefined) {
          return 'Sent for publish on ' + $filter('date')(task.goLiveDate, 'MMM. dd, yyyy');
        }
        return 'Sent for publish on ' + $filter('date')(task.returnDate, 'MMM. dd, yyyy');
      }
      else if (task.status === 'Returned') {
        self.statusDate = $filter('date')(task.returnDate, 'MMM. dd, yyyy');
        return 'Returned';
      }

      else if (task.status === 'omitted') {
        return 'Not required';
      }

      // Academy Published Task
      else if ((task.status === 'Published' || task.status === 'published') &&
                isAcademy) {
        self.statusDate = $filter('date')(task.publishedOn, 'MMM. dd, yyyy');
        return 'Published';
      }

      // Non-Academy Published Task
      else if (task.status === 'Published') {
        self.statusDate = $filter('date')(task.publishDate, 'MMM. dd, yyyy');
        return 'Published';
      }

      else if (task.status === 'will_publish' ||
               self.offeringStatus === 'pending_publish' ||
               self.offeringStatus === 'will_publish') {
        return 'Will be published on ' + $filter('date')(task.goLiveDate, 'MMM. dd, yyyy');
      }

      else {
        return 'Unavailable status';
      }

    };

    function getIntegrationStatus(task) {
      if (task.status === 'Returned') {
        self.statusDate = $filter('date')(task.saveDate, 'MMM. dd, yyyy');
        return 'Returned';
      } else if (task.status === 'Draft') {
        self.statusDate = $filter('date')(task.saveDate, 'MMM. dd, yyyy');
        return 'Last modified';
      } else if (task.status === 'Complete') {
        self.statusDate = $filter('date')(task.saveDate, 'MMM. dd, yyyy');
        return 'Complete';
      }
      else if (task.status === 'Published') {
        if (task.publishDate !== undefined) {
          self.statusDate = $filter('date')(task.publishDate, 'MMM. dd, yyyy');
          return 'Published';
        }
        else {
          return 'Complete';
        }
      }
      else if (task.status === 'omitted') {
        return 'Not required';
      }
    }

  }
})();
