//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  angular.module('common.input').component('pwbInputError', {
    templateUrl: 'common/app/input/error.html',
    bindings: {
      errMessage: '@',
      showErr: '='
    }
  });
})();
