//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.input').component('pwbTextInput', {
    controller: function() {
      this.regexPattern = new RegExp(this.pattern);
    },
    templateUrl: 'common/app/input/text.html',
    bindings: {
      inputId: '@',
      inputName: '@',
      label: '@',
      description: '@',
      placeholder: '@',
      model: '=',
      maxLength: '<',
      minLength: '<',
      isRequired: '<',
      pattern: '@',
      onChange: '&',
      deletable: '<',
      onDelete: '&'
    },
    transclude: true,
    require: {
      formCtrl: '^form'
    }
  });
})();
