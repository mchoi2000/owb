//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.input').component('pwbInputSubsection', {
    templateUrl: 'common/app/input/subsection.html',
    bindings: {
      label: '@',
      description: '@'
    },
    transclude: true
  });
})();
