//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.user', []);

  angular.module('common.user').factory('UserService', ['$http', userService]);

  function userService($http) {
    var baseURL = 'api/user';
    var service = {
      get: get,
      getUser: getUser,
      getAll: getAll,
      updateFeatures: updateFeatures,
      inviteUser: inviteUser,
      removeUsers: removeUsers,
      resendInvite: resendInvite,
      joinLocale: joinLocale,
      updateUser: updateUser
    };

    return service;

    function get() {
      return $http.get('api/user')
        .then(function httpGetApiUserCallback(data) {
          return data.data;
        });
    }

    function getUser(id) {
      return $http.get('api/user/' + encodeURIComponent(id))
      .then(function httpGetApiUserCallback(data) {
        return data.data;
      });
    }

    function getAll() {
      return $http.get('api/user/all')
        .then(function httpGetAllApiUserCallback(data) {
          return data.data;
        });
    }

    function updateFeatures(id, features) {
      return $http.post('api/user/updateFeatures/' + encodeURIComponent(id), features);
    }

    function inviteUser(newUser) {
      return $http.post('api/user/invite/' , newUser);
    }

    function removeUsers(removeData) {
      return $http.post('api/user/removeUsers' , removeData);
    }

    function resendInvite(resendData) {
      return $http.post('api/user/resendInvite' , resendData);
    }

    function joinLocale(locales) {
      return $http.post('api/user/joinLocale' , locales);
    }

    function updateUser(user) {
      return $http.post('api/user/updateUser' , user);
    }
  }
})();
