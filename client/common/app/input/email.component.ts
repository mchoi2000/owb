//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.input').component('pwbEmailInput', {
    controller: function() {
      this.regexPattern = new RegExp(this.pattern);
    },
    templateUrl: 'common/app/input/email.html',
    bindings: {
      inputId: '@',
      inputName: '@',
      label: '@',
      description: '@',
      placeholder: '@',
      model: '=',
      isRequired: '<',
      onChange: '&'
    },
    transclude: true,
    require: {
      formCtrl: '^form'
    }
  });
})();
