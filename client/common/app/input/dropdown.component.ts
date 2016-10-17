//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  class dropdownController {

    display: any = {};

    $onChanges(changeObj) {
      if (changeObj.list) {
        this.initList(changeObj.list.currentValue);
      }
    }

    private initList(list) {
      list.forEach((listItem) => {
        console.log(listItem);
        this.display[listItem.value] = listItem.display;
      });
    }
  }

  angular.module('common.input').component('pwbDropdownInput', {
    controller: dropdownController,
    templateUrl: 'common/app/input/dropdown.html',
    bindings: {
      inputId: '@',
      inputName: '@',
      label: '@',
      description: '@',
      model: '=',
      list: '<',
      isRequired: '<',
      isDisabled: '<',
      onChange: '&?'
    },
    transclude: true,
    require: {
      formCtrl: '^form'
    }
  });
})();
