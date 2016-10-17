//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('Review Tile Component', function() {
  var $componentController;
  var myFilter;

  beforeEach(module('common.dashboard'));
  beforeEach(inject(function(_$componentController_, _$filter_) {
    $componentController = _$componentController_;
    myFilter = _$filter_;
  }));

  it('should load bindings with incorrect task name', function() {
    var bindings = {
      taskName: 'bad task name',
      status: 'qualification_submitted',
      task: {
        editDate: '2016-09-16T05:00:00.000Z',
        submitDate: '2016-09-16T05:00:00.000Z',
        publishDate: '2016-09-16T05:00:00.000Z',
        returnDate: '2016-09-16T05:00:00.000Z'
      }
    };
    var ctrl = $componentController('pwbReviewDashboardTile', null, bindings);
    expect(ctrl.statusMessage).toEqual(undefined);
  });

  it('Check Qualification Review statuses', function() {
    var bindings = {
      taskName: 'Offering Qualification',
      status: 'qualification_submitted',
      task: {
        editDate: '2016-09-16T05:00:00.000Z',
        submitDate: '2016-09-16T05:00:00.000Z',
        publishDate: '2016-09-16T05:00:00.000Z',
        returnDate: '2016-09-16T05:00:00.000Z'
      }
    };
    var ctrl = $componentController('pwbReviewDashboardTile', null, bindings);
    expect(ctrl.statusMessage).toEqual('Submitted on Sep. 16, 2016');

    bindings.status = 'qualification_approved';
    ctrl = $componentController('pwbReviewDashboardTile', null, bindings);
    expect(ctrl.statusMessage).toEqual('Approved on Sep. 16, 2016');

    bindings.status = 'qualification_returned';
    ctrl = $componentController('pwbReviewDashboardTile', null, bindings);
    expect(ctrl.statusMessage).toEqual('Returned on Sep. 16, 2016');

    bindings.status = 'Bad Status';
    ctrl = $componentController('pwbReviewDashboardTile', null, bindings);
    expect(ctrl.statusMessage).toEqual(undefined);

  });

  it('Check Content Review statuses', function() {
    var bindings = {
      taskName: 'Offering Content',
      status: 'InReview',
      task: {
        editDate: '2016-09-16T05:00:00.000Z',
        submitDate: '2016-09-16T05:00:00.000Z',
        publishDate: '2016-09-16T05:00:00.000Z',
        returnDate: '2016-09-16T05:00:00.000Z'
      }
    };
    var ctrl = $componentController('pwbReviewDashboardTile', null, bindings);
    expect(ctrl.statusMessage).toEqual('Submitted on Sep. 16, 2016');

    bindings.status = 'Approved';
    ctrl = $componentController('pwbReviewDashboardTile', null, bindings);
    expect(ctrl.statusMessage).toEqual('Approved on Sep. 16, 2016');

    bindings.status = 'Returned';
    ctrl = $componentController('pwbReviewDashboardTile', null, bindings);
    expect(ctrl.statusMessage).toEqual('Returned on Sep. 16, 2016');

    bindings.status = 'Any other status to return approved';
    ctrl = $componentController('pwbReviewDashboardTile', null, bindings);
    expect(ctrl.statusMessage).toEqual('Approved on Sep. 16, 2016');

  });

  it('Check Commerce Review statuses', function() {
    var bindings = {
      taskName: 'Offering Commerce',
      status: 'InReview',
      task: {
        editDate: '2016-09-16T05:00:00.000Z',
        submitDate: '2016-09-16T05:00:00.000Z',
        publishDate: '2016-09-16T05:00:00.000Z',
        returnDate: '2016-09-16T05:00:00.000Z'
      }
    };
    var ctrl = $componentController('pwbReviewDashboardTile', null, bindings);
    expect(ctrl.statusMessage).toEqual('Submitted on Sep. 16, 2016');

    bindings.status = 'Approved';
    ctrl = $componentController('pwbReviewDashboardTile', null, bindings);
    expect(ctrl.statusMessage).toEqual('Approved on Sep. 16, 2016');

    bindings.status = 'Returned';
    ctrl = $componentController('pwbReviewDashboardTile', null, bindings);
    expect(ctrl.statusMessage).toEqual('Returned on Sep. 16, 2016');

    bindings.status = 'Any other status to return approved';
    ctrl = $componentController('pwbReviewDashboardTile', null, bindings);
    expect(ctrl.statusMessage).toEqual('Approved on Sep. 16, 2016');

  });

});
