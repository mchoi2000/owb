(function() {
  'use strict';

  var registrationData = {
    roleList: [
      {name: 'Offering manager', value: 'Offering manager'},
      {name: 'Marketing manager', value: 'Marketing manager'},
      {name: 'Portfolio manager', value: 'Portfolio manager'},
      {name: 'Developer', value: 'Developer'},
      {name: 'Other', value: 'Other'}
    ]
  };

  angular.module('register').value('RegistrationData', registrationData);

})();
