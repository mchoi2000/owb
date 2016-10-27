(function() {
  'use strict';

  angular.module('register').controller('RegistrationController',
    ['$http', '$window', '$uibModal', 'RegistrationData', RegistrationController]);

  function RegistrationController($http, $window, $uibModal, RegistrationData) {
    /* jshint validthis: true */
    var self = this;

    self.openTermsOfUseModal = openTermsOfUseModal;
    function openTermsOfUseModal() {
      self.modalInstance = $uibModal.open({
        templateUrl: 'termsOfUseModal.html',
        windowClass: 'terms_of_use_modal',
        controller: 'ModalTermsOfUseController',
        controllerAs: 'ctrlTOU'
      });
    }

    self.getUser = getUser;
    function getUser() {
      $http.get('api/user')
        .then(function httpGetApiUserCallback(data) {
          self.user = data.data;
        });
    }

    self.acceptRegistration = acceptRegistration;
    function acceptRegistration(registerForm) {
      registerForm.projectRole.$setViewValue(self.role);

      if (!registerForm.$invalid) {
        $http({
          method: 'POST',
          url: 'auth/register',
          data: self.user,
          headers: {
            'Content-Type': 'application/json'
          }
        }).finally(function() {
          $window.location.href = 'provider/dashboard';
        });
      }
    }

    self.updateRoleOption = updateRoleOption;
    function updateRoleOption(value, isSelected) {
      if (value !== 'Other' && isSelected) {
        self.roleSelection = value;
        self.role = value;
      } else if (value === 'Other' && isSelected) {
        self.roleSelection = value;
        self.role = '';
      }

      if (!isSelected) {
        self.role = value;
      }
    }

    self.initialize = initialize;
    function initialize() {
      self.roleSelection = 'Please Select A Role';
      self.roles = RegistrationData.roleList;
    }

    self.initialize();
  }

})();
