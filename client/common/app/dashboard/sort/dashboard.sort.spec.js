//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('Sort Component', function() {
  var $componentController;

  beforeEach(module('common.dashboard'));
  beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
  }));

  it('should load bindings', function() {
    var bindings = {test: 'test'};
    var ctrl = $componentController('pwbDashboardSort', null, bindings);
    expect(ctrl.test).toEqual('test');
  });

  it('should call the onUpdate', function() {
    var onUpdateSpy = jasmine.createSpy('onUpdate');
    var bindings = {offeringId: {}, onUpdate: onUpdateSpy};
    var ctrl = $componentController('pwbDashboardSort', null, bindings);

    ctrl.update({value: 'test', name: 'T'});
    expect(onUpdateSpy).toHaveBeenCalledWith({name: 'T', value: 'test'});
  });

  it('should call the onInit', function() {
    var onInitSpy = jasmine.createSpy('$onInit');
    var bindings = {offeringId: {}, $onInit: onInitSpy};
    var ctrl = $componentController('pwbDashboardSort', null, bindings);

    ctrl.$onInit();
    expect(ctrl.updatedSort).toEqual(false);
  });

});
