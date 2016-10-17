'use strict';

describe('ArrayHelper', function () {
  var collabService;

  var mockUser = 'user';
  var mockProduct = 'product';

  beforeEach(module('common.collab'));

  beforeEach(function() {
    var mock = {
      open: function(config) {
        expect(config.templateUrl).toEqual('common/app/collab/collaborateModalPartial.html');
        expect(config.controller).toEqual('CollaborateModalController');
        expect(config.controllerAs).toEqual('ctrlCM');
        expect(config.backdrop).toEqual('static');
        expect(config.windowClass).toEqual('participant_modal');
        expect(config.resolve.modalData.product).toEqual(mockProduct);
        expect(config.resolve.modalData.currentUser).toEqual(mockUser);
      }
    };

    module(function($provide) {
      $provide.value('$uibModal', mock);
    });

    inject(function($injector) {
      collabService = $injector.get('CollabService');
    });
  });

  it('should open modal', function() {
    collabService.openModal(mockProduct, mockUser);
  });
});
