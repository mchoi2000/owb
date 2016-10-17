//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('Initial Task Component', function() {
  var $componentController;

  beforeEach(module('common.dashboard'));
  beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
  }));

  it('should load bindings - all options', function() {
    var bindings = {status: 'Not Started', taskName:  'Content Task'};
    var ctrl = $componentController('pwbInitialTask', null, bindings);
    expect(ctrl.taskName).toEqual('Content Task');
    expect(ctrl.taskIcon).toEqual('icon-doc');
    expect(ctrl.iconColor).toEqual('');

    bindings = {status: 'Last modified'};
    ctrl = $componentController('pwbInitialTask', null, bindings);

    expect(ctrl.iconColor).toEqual('purple');

    bindings = {status: 'Returned'};
    ctrl = $componentController('pwbInitialTask', null, bindings);
    expect(ctrl.iconColor).toEqual('red');

    bindings = {status: 'Published'};
    ctrl = $componentController('pwbInitialTask', null, bindings);
    expect(ctrl.iconColor).toEqual('green');

    bindings = {status: 'Not Started', taskName: 'Commerce Task'};
    ctrl = $componentController('pwbInitialTask', null, bindings);
    expect(ctrl.taskIcon).toEqual('icon-shopping-cart');

    bindings = {status: 'Not Started', taskName: 'Integration Task'};
    ctrl = $componentController('pwbInitialTask', null, bindings);
    expect(ctrl.taskIcon).toEqual('icon-markup');

    bindings = {status: 'Submitted', taskName: 'Commerce Task'};
    ctrl = $componentController('pwbInitialTask', null, bindings);
    expect(ctrl.taskIcon).toEqual('icon-lock');

    bindings = {status: 'Not required', taskName: 'Commerce Task'};
    ctrl = $componentController('pwbInitialTask', null, bindings);
    expect(ctrl.taskIcon).toEqual('icon-omitted-circle');

  });
});
