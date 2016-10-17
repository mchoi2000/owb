//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.scroller', []).factory('Scroller', ['$window', Scroller]);

  function Scroller($window) {

    var scrollerFunctions = {};
    var callBackFunction;

    scrollerFunctions.onDocumentEnd = onDocumentEnd;
    function onDocumentEnd(callback) {
      callBackFunction = callback;
      $window.addEventListener('scroll', onDocumentEndHandler);
    }

    scrollerFunctions.removeDocumentEndHandler = removeDocumentEndHandler;
    function removeDocumentEndHandler() {
      $window.removeEventListener('scroll', onDocumentEndHandler);
    }

    function onDocumentEndHandler() {
      //Get the current window height
      var visibleWindowHeight = $window.innerHeight;
      //Get total scrolled height above visible window
      var scrolledHeight = window.pageYOffset;
      var bottom = visibleWindowHeight + scrolledHeight;
      //Get the total document height: visible, scrolled elements and elements below.
      var documentHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight);
      if (bottom >= (documentHeight - 200)) {
        callBackFunction();
      }
    }

    return scrollerFunctions;
  }
})();
