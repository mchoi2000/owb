//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.input').component('pwbInputGroup', {
    templateUrl: 'common/app/input/group.html',
    bindings: {
      label: '@?',
      subformName: '@',
      model: '=',
      isRequired: '<?',
      minItems: '<?',
      maxItems: '<?',
      addItem: '&',
      onDelete: '&?',
      addMoreText: '@?'
    },
    transclude: true
  });
})();
