//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('Container Component', function() {
  var $componentController;

  beforeEach(module('common.dashboard'));
  beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
  }));

  it('should load bindings', function() {
    var bindings = {test: 'test'};
    var ctrl = $componentController('pwbDashboardContainer', null, bindings);
    expect(ctrl.test).toEqual('test');
  });

});
