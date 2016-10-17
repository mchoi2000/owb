//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.navigation', []).factory('NavigationService', [
    '$window',
    '$rootScope',
    '$timeout',
    '$anchorScroll',
    NavigationService
  ]);

  function NavigationService($window, $rootScope, $timeout, $anchorScroll) {

    function Navigator(sectionList, stickyYOffset, gotoYOffset) {
      this.sectionList = sectionList;
      this.scrolledToSection = false;
      this.stickyYOffset = stickyYOffset;
      this.gotoYOffset = gotoYOffset || 100;

      this.currentSection = undefined;
      this.stickNav = false;
    }

    Navigator.prototype.removeSection = function removeSection(sectionName) {
      var index = this.sectionList.map(function(section) {
        return section.name;}).indexOf(sectionName);
      this.sectionList.splice(index, 1);
    };

    Navigator.prototype.addSection = function addSection(atIndex, section) {
      this.sectionList.splice(atIndex, 0, section);
    };

    Navigator.prototype.scrollToSection = function scrollToSection() {
      this.stickNav = $window.pageYOffset > this.stickyYOffset;

      $rootScope.$apply();
      if (this.scrolledToSection) {
        this.scrolledToSection = false;
        return;
      }

      try {
        for (var i = 1; i < this.sectionList.length; i++) {
          var previous = findPos(this.sectionList[i - 1].name);
          var next = findPos(this.sectionList[i].name);

          if ($window.pageYOffset >= previous && $window.pageYOffset < next) {
            this.currentSection = this.sectionList[i - 1].value;
            return;
          }
        }

        var lastSection = this.sectionList[this.sectionList.length - 1];
        if ($window.pageYOffset > findPos(lastSection.name)) {
          this.currentSection = lastSection.value;
          return;
        }
      } catch (err) {
        //For offset undefined errors
        this.currentSection = undefined;
        return;
      }

      this.currentSection = undefined;
      return;
    };

    Navigator.prototype.goToSection = function goToSection(section) {
      var self = this;
      var resultValues = {};

      self.scrolledToSection = true;
      $anchorScroll(section.name);
      $timeout(function() {
        // Apply second scroll to allow DOM changes
        $anchorScroll(section.name);
        $window.scrollTo(0, $window.pageYOffset - self.gotoYOffset);
        self.currentSection = section.value;
      });
    };

    Navigator.prototype.scrollToBottom = function scrollToBottom() {
      $timeout(function() {
        var documentHeight = Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight);
        $window.scrollTo(0, documentHeight - 100);
      }, 0);
    };

    function findPos(id) {
      var offset = angular.element(document.querySelector('#' + id)).offset();
      var top = offset.top  - 120;
      return top;
    }

    return Navigator;
  }
})();
