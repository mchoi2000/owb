//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  // total tile component
  angular.module('common.dashboard').component('pwbDashboardTile', {
    templateUrl: 'common/app/dashboard/tile/dashboard.tile.html',
    controller: DashboardTileController,
    transclude: true,
    restrict: 'E',
    bindings: {
      status: '@',
      isAcademy: '<?',
      isReviewTile: '='
    }
  });

  /*jshint maxcomplexity:20 */
  function DashboardTileController() {
    var self = this;

    self.styleClass = 'tile-status-approved';

    if (self.status === 'published' ||
        self.status === 'Published' ||
        self.status === 'Published Update') {
      self.styleClass = 'tile-status-published';
    }

    // Review Tiles - Set Review Flag here
    else if ((self.status === 'qualification_submitted' ||
              self.status === 'Submitted' ||
              self.status === 'InReview') && self.isReviewTile) {
      self.styleClass = 'tile-status-needs-review';
    } else if ((self.status === 'qualification_returned' && self.isReviewTile) ||
               (self.status === 'Returned' && self.isReviewTile)) {
      self.styleClass = 'review-tile-status-returned';
    }
    else if (self.isReviewTile) {
      self.styleClass = 'review-tile-status-approved';
    }

  }
})();
