//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  // component for sort page
  angular.module('common.dashboard').component('pwbDashboardSort', {
    templateUrl: 'common/app/dashboard/sort/dashboard.sort.html',
    controller: DashboardSortComponent,
    bindings: {
      sortProductsName: '=',
      isDisabled: '&',
      sortOptionsList: '<',
      onUpdate: '&'
    }
  });

  function DashboardSortComponent() {
    var self = this;

    self.$onInit = function init() {
      self.updatedSort = false;
    };

    self.update = function update(myOption) {
      self.updatedSort = true;
      self.onUpdate({name: myOption.name, value: myOption.value});
    };
  }

})();
