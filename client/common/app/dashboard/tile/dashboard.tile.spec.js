//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('Tile Component', function() {
  var $componentController;

  beforeEach(module('common.dashboard'));
  beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
  }));

  it('load different statuses', function() {
    var bindings = {status:  'qualification_approved'};
    var ctrl = $componentController('pwbDashboardTile', null, bindings);
    expect(ctrl.styleClass).toEqual('tile-status-approved');

    bindings = {status:  'published'};
    ctrl = $componentController('pwbDashboardTile', null, bindings);
    expect(ctrl.styleClass).toEqual('tile-status-published');

    bindings = {status:  'other'};
    ctrl = $componentController('pwbDashboardTile', null, bindings);
    expect(ctrl.styleClass).toEqual('tile-status-approved');

    // Review Statuses
    bindings = {status:  'qualification_submitted', isReviewTile: true};
    ctrl = $componentController('pwbDashboardTile', null, bindings);
    expect(ctrl.styleClass).toEqual('tile-status-needs-review');

    bindings = {status:  'qualification_approved', isReviewTile: true};
    ctrl = $componentController('pwbDashboardTile', null, bindings);
    expect(ctrl.styleClass).toEqual('review-tile-status-approved');

    bindings = {status:  'qualification_returned', isReviewTile: true};
    ctrl = $componentController('pwbDashboardTile', null, bindings);
    expect(ctrl.styleClass).toEqual('review-tile-status-returned');

    bindings = {status:  'Approved', isReviewTile: true};
    ctrl = $componentController('pwbDashboardTile', null, bindings);
    expect(ctrl.styleClass).toEqual('review-tile-status-approved');

    bindings = {status:  'Returned', isReviewTile: true};
    ctrl = $componentController('pwbDashboardTile', null, bindings);
    expect(ctrl.styleClass).toEqual('review-tile-status-returned');
  });

  it('should load Academy Statuses', function() {
    var bindings = {status:  'Not Started', isAcademy: true};
    var ctrl = $componentController('pwbDashboardTile', null, bindings);
    expect(ctrl.styleClass).toEqual('tile-status-approved');
    bindings = {status:  'Content Modified', isAcademy: true};
    ctrl = $componentController('pwbDashboardTile', null, bindings);
    expect(ctrl.styleClass).toEqual('tile-status-approved');
    bindings = {status:  'Published', isAcademy: true};
    ctrl = $componentController('pwbDashboardTile', null, bindings);
    expect(ctrl.styleClass).toEqual('tile-status-published');
    bindings = {status:  'Published Update', isAcademy: true};
    ctrl = $componentController('pwbDashboardTile', null, bindings);
    expect(ctrl.styleClass).toEqual('tile-status-published');
  });
});
