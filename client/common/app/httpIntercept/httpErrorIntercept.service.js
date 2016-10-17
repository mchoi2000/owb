//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.httpErrorIntercept', ['common.error', 'common.userInformation'])
  .factory('HttpErrorInterceptor',
  ['$q','ErrorNotification', 'UserInformation','$injector', interceptErrorRespose])
  .config(function configureHttpIntercept($httpProvider) {
    $httpProvider.interceptors.push('HttpErrorInterceptor');
  });

  function interceptErrorRespose($q, ErrorNotification, UserInformation, $injector) {

    return ({
      responseError: responseError
    });

    function responseError(response) {
      var userInfo = UserInformation.getUserInformation();

      if (response.status === 403) {
        ErrorNotification.sessionError(response);
      } else if (response.status === 500) {
        ErrorNotification.serverError(response);
        userInfo.error = response;
        logError(userInfo);
      } else if ([409, 400].indexOf(response.status) > -1) {
        //Do nothing
        return $q.reject(response);
      } else if (response.status > 99 && response.status < 600) {
        ErrorNotification.unknownError(response);
        userInfo.error = response;
        logError(userInfo);
      }

      return $q.reject(response);

    }

    //Sends information to the logging API
    function logError(userInfo) {
      var $http = $injector.get('$http');
      return $http.post('api/log' ,userInfo);
    }

  }

})();
