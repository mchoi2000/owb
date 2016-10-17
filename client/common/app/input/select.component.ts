//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  class SelectInputController {
    maxSelect: any;
    minSelect: any;
    optionList: any;
    model: any;
    formCtrl: any;
    inputName: any;

    $onInit() {
      if (angular.isUndefined(this.maxSelect)) {
        this.maxSelect = this.optionList.length + 1;
      }

      if (angular.isUndefined(this.minSelect)) {
        this.minSelect = 0;
      }
    }

    $postLink() {
      if (this.model) {
        this.checkValid();
      }
    }

    $onChanges(changeVal) {
      if (changeVal.model) {
        this.checkValid();
      }
    }

    private checkValid() {
      this.formCtrl[this.inputName]
          .$setValidity('tooFewSelected', this.model.length >= this.minSelect);

      this.formCtrl[this.inputName]
          .$setValidity('tooManySelected', this.model.length <= this.maxSelect);
    }
  }
  angular.module('common.input').component('pwbSelectInput', {
    controller: SelectInputController,
    templateUrl: 'common/app/input/select.html',
    bindings: {
      inputId: '@',
      inputName: '@',
      label: '@?',
      description: '@?',
      model: '=',
      optionList: '<',
      minSelect: '<?',
      maxSelect: '<?',
      isDisabled: '<?',
      onChange: '&?'
    },
    transclude: true,
    require: {
      formCtrl: '^form'
    }
  });
})();
