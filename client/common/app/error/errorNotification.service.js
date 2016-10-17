//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.error').service('ErrorNotification',
    ['$injector', ErrorNotification]);

  function ErrorNotification($injector) {

    var ErrorNotification = {};

    ErrorNotification.sessionError = sessionError;
    ErrorNotification.serverError = serverError;
    ErrorNotification.unknownError = unknownError;

    function sessionError(responseObject) {
      var toastr = $injector.get('toastr');
      var value = '<strong>We apologize.</strong> Your session has expired.' +
      'Please save your work and log back in';
      //Displays an error message to the client
      toastr.error(value);
    }

    function serverError(response) {
      var toastr = $injector.get('toastr');
      var value = '<strong>We apologize.</strong> Provider Workbench has experienced a problem ' +
        'and could not complete your action. For immediate assistance, contact ' +
        '<a class="toast-email" aria-label="Email - pwbteam@us.ibm.com" ' +
        'href="mailto:pwbteam@us.ibm.com?Subject=Question%20Regarding%20Using%20PWB" ' +
        'target="_top">pwbteam@us.ibm.com</a>.';
      //Displays an error message to the client
      toastr.error(value);
    }

    function unknownError(response) {
      var toastr = $injector.get('toastr');
      var value = '<strong>We apologize.</strong> Provider Workbench has experienced a problem ' +
        'and could not complete your action. For immediate assistance, contact ' +
        '<a class="toast-email" aria-label="Email - pwbteam@us.ibm.com" ' +
        'href="mailto:pwbteam@us.ibm.com?Subject=Question%20Regarding%20Using%20PWB" ' +
        'target="_top">pwbteam@us.ibm.com</a>.';
      //Displays an error message to the client
      toastr.error(value);
    }

    return ErrorNotification;
  }
})();
