//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {

  angular.module('common.spinner').component('pwbSpinner', {
    templateUrl: 'common/app/spinner/spinner.html',
    controller: ['$scope' , function($scope) {
      var self = this;

      self.loading = true;
      var to;
      var unwatch = $scope.$watch(function() {
        clearTimeout(to);
        to = setTimeout(function () {
          unwatch();
          self.loading = false;
          $scope.$apply();
        }, 100);
      });
    }]
  });
})();
