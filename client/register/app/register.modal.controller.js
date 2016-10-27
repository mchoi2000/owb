(function() {
  'use strict';

  // Modal Controller
  angular.module('register').controller('ModalTermsOfUseController',
  ['$uibModalInstance', TOUController]);

  function TOUController ($uibModalInstance) {
    // jshint validthis: true
    var _this = this;

    _this.closeModal = closeModal;
    function closeModal() {
      $uibModalInstance.dismiss('cancel');
    }
  }

})();
