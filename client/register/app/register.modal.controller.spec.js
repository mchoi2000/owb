'use strict';

describe('Register modal controller', function() {
  var $controller;

  beforeEach(module('register'));

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  it('should close modal', function(done) {
    var ctrl = $controller('ModalTermsOfUseController', {
      $uibModalInstance: {
        dismiss: function(event) {
          expect(event).toBe('cancel');
          done();
        }
      }
    });
    ctrl.closeModal();
    done();
  });

});
