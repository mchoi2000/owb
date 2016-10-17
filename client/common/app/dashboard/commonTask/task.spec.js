//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('Common Task Component', function() {
  var $componentController;
  var myFilter;

  beforeEach(module('common.dashboard'));
  beforeEach(inject(function(_$componentController_, _$filter_) {
    $componentController = _$componentController_;
    myFilter = _$filter_;
  }));

  it('should load bindings', function() {
    var bindings = {
      linkedStatus:  ''
    };
    var ctrl = $componentController('pwbTask', null, bindings);
    expect(ctrl.status).toEqual('');
  });

  it('Check Generic (Content) Task statuses', function() {
    var bindings = {linkedStatus:  '', taskName: 'Content Task'};
    var ctrl = $componentController('pwbTask', null, bindings);
    expect(ctrl.getStatus({
        status: 'Not Started',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, false)
    ).toEqual('Not Started');
    expect(ctrl.getStatus({
        status: 'Incomplete',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, false)
    ).toEqual('Last modified');
    expect(ctrl.getStatus({
        status: 'InReview',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, false)
    ).toEqual('Submitted');
    expect(ctrl.getStatus({
        status: 'will_publish',
        goLiveDate: '2016-09-16T05:00:00.000Z',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, false)
    ).toEqual('Will be published on Sep. 16, 2016');
    expect(ctrl.getStatus({
        status: 'Returned',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, false)
    ).toEqual('Returned');
    expect(ctrl.getStatus({
        status: 'Published',
        goLiveDate: '2016-09-16T05:00:00.000Z',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, false)
    ).toEqual('Published');
    expect(ctrl.getStatus({
        status: 'InReview',
        goLiveDate: '2016-09-16T05:00:00.000Z',
        editDate: '0',
        submitDate: '0',
        publishDate: '2016-09-16T05:00:00.000Z',
        returnDate: '0'
      }, false)
    ).toEqual('Submitted');
    expect(ctrl.getStatus({
        status: 'pending_publish',
        goLiveDate: '2016-09-16T05:00:00.000Z',
        editDate: '0',
        submitDate: '0',
        publishDate: '2016-09-16T05:00:00.000Z',
        returnDate: '0'
      }, false)
    ).toEqual('Sent for publish on Sep. 16, 2016');
    expect(ctrl.getStatus({
        status: 'pending_publish',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '2016-09-16T05:00:00.000Z'
      }, false)
    ).toEqual('Sent for publish on Sep. 16, 2016');
    expect(ctrl.getStatus({
        status: 'bad status',
        goLiveDate: '2016-09-16T05:00:00.000Z',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, false)
    ).toEqual('Unavailable status');
    bindings = {taskName: 'Content Task', offeringStatus: 'will_publish'};
    expect(ctrl.getStatus({
        status: 'will_publish',
        goLiveDate: '2016-09-16T05:00:00.000Z',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, false)
    ).toEqual('Will be published on Sep. 16, 2016');
  });

  it('Check Academy task status', function() {
    var bindings = {linkedStatus:  '', taskName: 'Content Task', isAcademy: true};
    var ctrl = $componentController('pwbTask', null, bindings);

    expect(ctrl.getStatus({
        status: 'Content Modified',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, true)
    ).toEqual('Last modified');
    expect(ctrl.getStatus({
        status: 'Published Update',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, true)
    ).toEqual('Last modified');
    expect(ctrl.getStatus({
        status: 'Published',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, true)
    ).toEqual('Published');
  });

  it('Check omitted task status', function() {
    var bindings = {status:  'qualification_approved', isAcademy: false, taskName: 'Content Task'};
    var ctrl = $componentController('pwbTask', null, bindings);

    expect(ctrl.getStatus({
      status: 'omitted'
    })).toEqual('Not required');
  });

  it('Check returned integration task status', function() {
    var bindings = {linkedStatus: '', taskName: 'Integration Task'};
    var ctrl = $componentController('pwbTask', null, bindings);

    expect(ctrl.getStatus({
        status: 'Draft',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, true)
    ).toEqual('Last modified');
    expect(ctrl.getStatus({
        status: 'Returned',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, true)
    ).toEqual('Returned');
    expect(ctrl.getStatus({
        status: 'Complete',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, true)
    ).toEqual('Complete');
    expect(ctrl.getStatus({
        status: 'Published',
        editDate: '0',
        submitDate: '0',
        returnDate: '0'
      }, true)
    ).toEqual('Complete');
    expect(ctrl.getStatus({
        status: 'Published',
        editDate: '0',
        submitDate: '0',
        publishDate: '2016-09-16T05:00:00.000Z',
        returnDate: '0'
      }, true)
    ).toEqual('Published');
    expect(ctrl.getStatus({
        status: 'omitted',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, true)
    ).toEqual('Not required');

    ctrl.getStatus({
        status: 'bad status',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, true);
  });

  it('Check Commerce task status', function() {
    var bindings = {linkedStatus:  'test linked status', taskName: 'Commerce Task'};
    var ctrl = $componentController('pwbTask', null, bindings);

    expect(ctrl.getStatus({
        status: 'will_publish',
        goLiveDate: '2016-09-16T05:00:00.000Z',
        editDate: '0',
        submitDate: '0',
        publishDate: '2016-09-16T05:00:00.000Z',
        returnDate: '0'
      }, false)
    ).toEqual('test linked status');

    ctrl.getStatus({
        status: 'will_publish',
        goLiveDate: '2016-09-16T05:00:00.000Z',
        editDate: '0',
        submitDate: '0',
        publishDate: '0',
        returnDate: '0'
      }, false);
  });

});
