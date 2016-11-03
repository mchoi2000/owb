//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.header').controller('HeaderController', [
    'UserService',
    '$route',
    '$location',
    'featureFlags',
    headerCtrl
  ]);

  function headerCtrl(UserService, $route, $location, featureFlags) {
    /* jshint validthis: true */
    var self = this;
    self.path = $location.path();

    // Added in to check if $route.current is undefined and on the register page
    // If so, manually set the page values since route.current is breaking in gulp serve:dist
    if ($route.current === undefined && self.path === '/register/register.html') {
      self.pageSlug = 'register';
      self.pageTitle = 'Join the Globalization Workbench';
    } else {
      self.pageSlug = $route.current.pageSlug;
      self.pageTitle = $route.current.pageTitle;
    }

    activate();

    function activate() {
      return UserService.get()
        .then(function userServiceGetCallback(data) {
          if (data.features) {
            var activeFeatures = [];
            for (var feature in data.features) {
              activeFeatures.push({key: data.features[feature], active: true});
            }

            featureFlags.set(activeFeatures);
          }

          self.user = data;
        });
    }
  }
})();
