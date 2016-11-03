(function() {
  'use strict';

  angular.module('register').controller('RegistrationController',
    ['$http', '$window', 'RegistrationData', RegistrationController]);

  function RegistrationController($http, $window, RegistrationData) {
    /* jshint validthis: true */
    var self = this;

    self.selectedLocales = [];

    self.getUser = getUser;
    function getUser() {
      $http.get('api/user')
        .then(function httpGetApiUserCallback(data) {
          self.user = data.data;
        });
    }

    self.getLocales = getLocales;
    function getLocales() {
      $http.get('api/locales')
        .then(function httpGetApiLocales(obj) {
          self.locales = obj.data;
        });
    }

    self.acceptRegistration = acceptRegistration;
    function acceptRegistration(registerForm) {
      registerForm.projectRole.$setViewValue(self.role);
      registerForm.projectLocales.$setViewValue(self.selectedLocales);
      console.log(registerForm);
      if (!registerForm.$invalid) {
        $http({
          method: 'POST',
          url: 'auth/register/cmm',
          data: self.user,
          headers: {
            'Content-Type': 'application/json'
          }
        }).finally(function() {
          $window.location.href = 'review/cmm';
        });
      }
    }

    self.updateRoleOption = updateRoleOption;
    function updateRoleOption(value, isSelected) {
      if (value === 'Other' && isSelected) {
        self.selectedRole = value;
        self.role = '';
      } else if (isSelected) {
        self.role = value;
        self.selectedRole = value;
      } else {
        self.role = value;
      }
    }

    self.initialize = initialize;
    function initialize() {
      self.roleSelection = 'Please Select A Role';
      self.roles = RegistrationData.roleList;
      self.selectedRole = 'Select one';
    }
    self.getLocales();
    self.initialize();
  }

})();
