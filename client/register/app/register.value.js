(function() {
  'use strict';

  var registrationData = {
    roleList: [
      {name: 'Country marketplace manager', value: 'Marketing manager'},
      {name: 'Portfolio marketing manager', value: 'Portfolio manager'},
      {name: 'Merchandising manager', value: 'Merchandising manager'},
      {name: 'Other', value: 'Other'}
    ]
  };

  angular.module('register').value('RegistrationData', registrationData);

})();
