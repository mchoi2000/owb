//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  // Review Dashboard Tile component
  angular.module('common.dashboard').component('pwbReviewDashboardTile', {
    templateUrl: 'common/app/dashboard/review/tile.html',
    controller: ReviewDashboardTileController,
    bindings: {
      limit: '<',
      offeringName: '@',
      task: '<',
      link: '@',
      status: '@',
      taskName: '@'
    }
  });

  function ReviewDashboardTileController($filter) {
    var self = this;
    function getStatusMessage(taskName) {
      if (self.taskName === 'Offering Qualification') {
        return getQualificationReviewStatus(self.task);
      } else if (self.taskName === 'Offering Content') {
        return getContentReviewStatus(self.task);
      } else if (self.taskName === 'Offering Commerce') {
        return getCommerceReviewStatus(self.task);
      }
    }

    function getQualificationReviewStatus(task) {
      if (self.status === 'qualification_submitted') {
        return 'Submitted on ' + $filter('date')(task.submitDate, 'MMM. dd, yyyy');
      } else if (self.status === 'qualification_approved') {
        return 'Approved on ' + $filter('date')(task.returnDate, 'MMM. dd, yyyy');
      } else if (self.status === 'qualification_returned') {
        return 'Returned on ' + $filter('date')(task.returnDate, 'MMM. dd, yyyy');
      }
    }

    function getContentReviewStatus(task) {
      if (self.status === 'Submitted' || self.status === 'InReview') {
        return 'Submitted on ' + $filter('date')(task.submitDate, 'MMM. dd, yyyy');
      }
      else if (self.status === 'Returned') {
        return 'Returned on ' + $filter('date')(task.returnDate, 'MMM. dd, yyyy');
      }
      return 'Approved on ' + $filter('date')(task.returnDate, 'MMM. dd, yyyy');
    }

    function getCommerceReviewStatus(task) {
      if (self.status === 'Submitted' || self.status === 'InReview') {
        return 'Submitted on ' + $filter('date')(task.submitDate, 'MMM. dd, yyyy');
      } else if (self.status === 'Returned') {
        return 'Returned on ' + $filter('date')(task.returnDate, 'MMM. dd, yyyy');
      }
      return 'Approved on ' + $filter('date')(task.returnDate, 'MMM. dd, yyyy');
    }

    self.statusMessage = getStatusMessage(self.taskName);
  }

})();
