'use strict';

describe('HttpErrorInterceptor', function () {

  var httpErrorInterceptorFactory;

  var mockErrorNotification = {
    sessionError: function() {
      return;
    },
    serverError: function() {
      return;
    },
    unknownError: function() {
      return;
    }
  };

  var mockUserInformation = {
    getUserInformation: function() {
      return {};
    }
  };

  beforeEach(module('common.httpErrorIntercept', function($provide) {
    $provide.value('ErrorNotification', mockErrorNotification);
    $provide.value('UserInformation', mockUserInformation);
  }));

  beforeEach(inject(function(HttpErrorInterceptor) {
    httpErrorInterceptorFactory = HttpErrorInterceptor;
  }));

  it('should intercept 403 error', function() {
    spyOn(mockErrorNotification, 'sessionError');
    httpErrorInterceptorFactory.responseError({status: 403, err: 'some error'});
    expect(mockErrorNotification.sessionError).toHaveBeenCalled();
  });

  it('should intercept 500 error', function() {
    spyOn(mockErrorNotification, 'serverError');
    httpErrorInterceptorFactory.responseError({status: 500, err: 'some error'});
    expect(mockErrorNotification.serverError).toHaveBeenCalled();
  });

  it('should do nothing for specified errors', function() {
    httpErrorInterceptorFactory.responseError({status: 409, err: 'some error'});
  });

  it('should intercept undefined error', function() {
    spyOn(mockErrorNotification, 'unknownError');
    httpErrorInterceptorFactory.responseError({status: 123, err: 'some error'});
    expect(mockErrorNotification.unknownError).toHaveBeenCalled();
  });

  it('should not intercept unknown error', function() {
    httpErrorInterceptorFactory.responseError({status: 55, err: 'some error'});
  });

});
