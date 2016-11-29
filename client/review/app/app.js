//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('review',
    [
      'ngAria',
      'common.loading',
      'common.spinner',
      'common.calendar',
      'review.cmm',
      'review.cmmDir'
    ]
  ).config(configuration);

  function configuration($locationProvider, $ariaProvider) {
    $locationProvider.html5Mode(true);

    $ariaProvider.config({
      ariaValue: true,
      tabindex: false,
      ariaHidden: false,
      bindKeypress: true,
      ariaChecked: true
    });
  }
})();
