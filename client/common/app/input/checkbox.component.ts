//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
///

(function() {
  'use strict';

  class CheckboxController {
    maxSelect: number;
    minSelect: number;
    onChange: any;
    list: any;
    model: any;
    formCtrl: any;
    inputName: any;

    $onInit() {
      if (angular.isUndefined(this.maxSelect)) {
        this.maxSelect = this.list.length + 1;
      }

      if (angular.isUndefined(this.minSelect)) {
        this.minSelect = 0;
      }

      if (angular.isUndefined(this.onChange)) {
        this.onChange = angular.noop;
      }
    }

    $onChanges(changeObj) {
      if (changeObj.mod) {
        this.initModel(changeObj.mod.currentValue);
      }
    }

    $postLink() {
      this.initModel(this.model);
    }

    private initModel(model) {
      if (model) {
        if (model.length > 0) {
          this.list.forEach((checkbox: any) => {
            checkbox.checked = model.indexOf(checkbox.value) >= 0;
          });
          this.setValidity();
        }

      }
    }

    updateModel() {
      this.model = this.list
          .filter( function(option) { return option.checked; })
          .map( function(option) { return option.value; });

      this.setValidity();
      this.onChange();
    };

    setValidity() {
      //This Might be undefined, if directive loads before form is complete
      if (this.formCtrl[this.inputName]) {
        this.formCtrl[this.inputName]
          .$setValidity('tooFewSelected', this.model.length >= this.minSelect);
      }
    }

  }
  angular.module('common.input').component('pwbCheckboxInput', {
    controller: CheckboxController,
    templateUrl: 'common/app/input/checkbox.html',
    bindings: {
      inputId: '@',
      inputName: '@',
      label: '@',
      description: '@',
      model: '=',
      mod: '<model', //Needed so $onChanges will detect changes
      list: '<',
      minSelect: '<?',
      maxSelect: '<?',
      onChange: '&?'
    },
    transclude: true,
    require: {
      formCtrl: '^form'
    }
  });
})();
