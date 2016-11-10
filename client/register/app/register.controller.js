(function() {
  'use strict';

  angular.module('register').controller('RegistrationController',
    ['$http', '$window', 'RegistrationData', RegistrationController]);

  function RegistrationController($http, $window, RegistrationData) {
    /* jshint validthis: true */
    var self = this;

    self.selectedLocales = [];
    self.localeRoleMaps = [];
    self.selecteBUs = [];

    self.acceptRegistration = acceptRegistration;
    self.updateRoleOption = updateRoleOption;
    self.changeLocales = changeLocales;
    self.checkAllRoles = checkAllRoles;
    self.isRolePortfolio = isRolePortfolio;
    self.initialize = initialize;

    function checkAllRoles() {
      return self.localeRoleMaps.filter(function (item) {
        return item.role === '';
      })[0];
    }

    function isRolePortfolio() {
      return self.localeRoleMaps.filter(function (item) {
        return item.role === 'Portfolio manager';
      })[0];
    }

    function changeLocales() {
      self.localeRoleMaps = self.selectedLocales.map(function(code) {
        var previousSelection = self.localeRoleMaps
                                .filter(function (prev) {return prev.locale === code;})[0];
        if (previousSelection) {
          return previousSelection;
        }
        return {locale: code, role: ''};
      });
      self.showOther = Array.apply(null, Array(self.localeRoleMaps.length)).map(function() {
                        return false;
                      });
    }

    function getCurrentUser() {
      $http.get('api/user')
      .then(function httpGetApiUserCallback(data) {
        self.user = data.data;
      });
    }

    function acceptRegistration(registerForm) {
      if (!registerForm.$invalid) {
        if (self.localeRoleMaps.length > 0) {
          self.user.info.locales = self.localeRoleMaps;
        }
        if (self.selecteBUs.length > 0) {
          self.user.info['business-units'] = self.selecteBUs;
        }
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

    function updateRoleOption(localeObj, value, index) {
      if (value === 'Other') {
        self.showOther[index] = true;
        localeObj.role = '';
      } else {
        self.showOther[index] = false;
        localeObj.role = value;
      }
    }

    function getLocales() {
      $http.get('api/locales')
      .then(function httpGetApiLocales(locales) {
        self.locales = locales.data.reduce(function(localeMap, currentLocale) {
          localeMap[currentLocale.locale] = currentLocale.name;
          return localeMap;
        }, {});
      });
    }

    function getTaxonomies() {
      $http.get('api/catalog/getTMTContactModules')
      .then(function httpGetCatalogCallback(data) {
        self.taxonomies = data.data;
        self.businessUnits = Object.keys(self.taxonomies);
      });
    }

    function initialize() {
      getCurrentUser();
      getLocales();
      getTaxonomies();
      self.roles = RegistrationData.roleList;
    }
    self.initialize();
  }

})();
