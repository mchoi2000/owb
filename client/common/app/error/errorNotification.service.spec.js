//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

describe('ErrorControllerTest', function() {

  beforeEach(module('common.error'));

  var errorService, toastr;
  var sessionErrorValue = '<strong>We apologize.</strong> Your session has expired.' +
  'Please save your work and log back in';
  var errorValue = '<strong>We apologize.</strong> Provider Workbench has experienced a problem ' +
    'and could not complete your action. For immediate assistance, contact ' +
    '<a class="toast-email" aria-label="Email - pwbteam@us.ibm.com" ' +
    'href="mailto:pwbteam@us.ibm.com?Subject=Question%20Regarding%20Using%20PWB" ' +
    'target="_top">pwbteam@us.ibm.com</a>.';

  beforeEach(inject(function(ErrorNotification, _toastr_) {
    errorService = ErrorNotification;
    toastr = _toastr_;
    spyOn(toastr, 'error').and.callThrough();
  }));

  it('should display session error', function() {
    errorService.sessionError({});
    expect(toastr.error).toHaveBeenCalledWith(sessionErrorValue);
  });

  it('should display server error', function() {
    errorService.serverError({});
    expect(toastr.error).toHaveBeenCalledWith(errorValue);
  });

  it('should display unknown error', function() {
    errorService.unknownError({});
    expect(toastr.error).toHaveBeenCalledWith(errorValue);
  });

});
