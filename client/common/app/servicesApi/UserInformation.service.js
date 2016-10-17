//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.userInformation', [])
    .service('UserInformation',['$window', UserInformation]);

  function UserInformation($window) {

    var UserInformation = {};

    UserInformation.getAppCodeName = getAppCodeName;
    function getAppCodeName() {
      return $window.navigator.appCodeName;
    }

    UserInformation.getAppName = getAppName;
    function getAppName() {
      return $window.navigator.appName;
    }

    UserInformation.getAppVersion = getAppVersion;
    function getAppVersion() {
      return $window.navigator.appVersion;
    }

    UserInformation.getPlatform = getPlatform;
    function getPlatform() {
      return $window.navigator.platform;
    }

    UserInformation.getUserAgent = getUserAgent;
    function getUserAgent() {
      return $window.navigator.userAgent;
    }

    UserInformation.isJavaEnabled = isJavaEnabled;
    function isJavaEnabled() {
      return $window.navigator.javaEnabled();
    }

    UserInformation.getMinorVersion = getMinorVersion;
    function getMinorVersion(_navigator) {
      var appVers = $window.navigator.appVersion;

      var pos, versMinor = 0;

      if ((pos = appVers.indexOf ('MSIE')) > -1) {
        versMinor = parseFloat(appVers.substr(pos + 5));
      } else {
        versMinor = parseFloat(appVers);
      }

      return (versMinor);
    }

    UserInformation.getMajorVersion = getMajorVersion;
    function getMajorVersion() {
      return parseInt($window.navigator.appVersion,10);
    }

    UserInformation.getScreenWidth = getScreenWidth;
    function getScreenWidth() {
      if ($window.screen) {
        return (screen.width);
      } else {
        return (0);
      }
    }

    UserInformation.getScreenHeight = getScreenHeight;
    function getScreenHeight() {
      if ($window.screen) {
        return (screen.height);
      } else {
        return (0);
      }
    }

    UserInformation.getDate = getDate;
    function getDate() {
      return new Date();
    }

    UserInformation.getReferrer = getReferrer;
    function getReferrer(referrer) {
      referrer = (referrer === '') ? '' : new URL(referrer).hostname;
      return referrer;
    }

    UserInformation.getCurrentPage = getCurrentPage;
    function getCurrentPage() {
      return $window.location.href;
    }

    UserInformation.getUserInformation = getUserInformation;
    function getUserInformation() {
      var result = {
        appCodeName: getAppCodeName(),
        appName: getAppName(),
        appVersion: getAppVersion(),
        platform: getPlatform(),
        userAgent: getUserAgent(),
        isJavaEnabled: isJavaEnabled(),
        minorVersion: getMinorVersion(),
        majorVersion: getMajorVersion(),
        screenWidth: getScreenWidth(),
        screenHeight: getScreenHeight(),
        date: getDate(),
        referrer: getReferrer(document.referrer),
        currentPage: getCurrentPage()
      };

      return result;
    }

    return UserInformation;
  }
})();
