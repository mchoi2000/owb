//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.input').component('pwbRadioInput', {
    templateUrl: 'common/app/input/radio.html',
    bindings: {
      inputId: '@',
      inputName: '@',
      label: '@?',
      description: '@?',
      model: '=',
      choices: '<',
      isRequired: '<',
      isDisabled: '<?',
      onChange: '&',
      clearable: '<?',
      onClear: '&?'
    },
    transclude: true,
    require: {
      formCtrl: '^form'
    }
  });
})();
