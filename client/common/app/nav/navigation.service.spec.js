'use strict';

describe('Navigation Service For Sticky Bar', function () {
  var NavigationService;
  var $window = {
    scrollTo: function(x, y) {
      return x + y;
    },
    addEventListener : function() {
      return;
    }
  };
  var $anchorScroll = jasmine.createSpy('anchorScroll');
  var scrolledToSection;
  var sectionList;
  var spy;
  var $timeout;

  beforeEach(module('common.nav'));

  beforeEach(function() {
    module(function($provide) {
      $provide.value('$window', $window);
      $provide.value('$anchorScroll', $anchorScroll);
    });

    inject(function($injector, _$timeout_) {
      NavigationService = $injector.get('NavigationService');
      $timeout = _$timeout_;
    });
    scrolledToSection = false;
    sectionList = [
      {name: 'key_offerings', value: 'Key Offerings'},
      {name: 'offering_review', value: 'Offering Review'}
    ];

  });

  it('should stick on scroll', function() {
    spyOn(document, 'querySelector').and.callFake(function (ele) {
      if (ele === '#key_offerings') {
        return 800;
      } else {
        return 900;
      }
    });
    spy = spyOn(angular, 'element').and.callFake(function (element) {
      return {
        offset: function() {
          return {
            top:  element
          };
        }
      };
    });
    $window.pageYOffset = 750;
    var stickNavAtPosition = 500;

    var nav = new NavigationService(sectionList, stickNavAtPosition);
    nav.scrollToSection();

    expect(nav.stickNav).toEqual(true);
    expect(nav.currentSection).toEqual('Key Offerings');
    spy.and.callThrough();
  });

  it('should display the last section', function() {
    spyOn(document, 'querySelector').and.callFake(function (ele) {
      if (ele === '#key_offerings') {
        return 800;
      } else {
        return 900;
      }
    });
    spy = spyOn(angular, 'element').and.callFake(function (element) {
      return {
        offset: function() {
          return {
            top:  element
          };
        }
      };
    });
    $window.pageYOffset = 950;
    var stickNavAtPosition = 500;

    var nav = new NavigationService(sectionList, stickNavAtPosition);
    nav.scrollToSection();
    expect(nav.stickNav).toEqual(true);
    expect(nav.currentSection).toEqual('Offering Review');
    spy.and.callThrough();
  });

  it('should stick on scroll, but not find section', function() {
    spyOn(document, 'querySelector').and.callFake(function (ele) {
      if (ele === '#key_offerings') {
        return 800;
      } else {
        return 900;
      }
    });
    spy = spyOn(angular, 'element').and.callFake(function (element) {
      return {
        offset: function() {
          return {
            top:  element
          };
        }
      };
    });
    $window.pageYOffset = 300;
    var stickNavAtPosition = 200;

    var nav = new NavigationService(sectionList, stickNavAtPosition);
    nav.scrollToSection();
    expect(nav.stickNav).toEqual(true);
    expect(nav.currentSection).toEqual(undefined);
    spy.and.callThrough();
  });

  it('should not find position on scroll', function() {
    $window.pageYOffset = 550;
    var stickNavAtPosition = 600;
    scrolledToSection = true;

    var nav = new NavigationService(sectionList, stickNavAtPosition);
    nav.scrollToSection();
    expect(nav.stickNav).toEqual(false);
    expect(nav.currentSection).toEqual(undefined);
  });

  it('should go to section', function () {
    var nav = new NavigationService(sectionList, 0);
    nav.goToSection({name: 'resources', value: 'resources'});
    $timeout.flush();
    expect(nav.scrolledToSection).toEqual(true);
    expect(nav.currentSection).toEqual('resources');
    expect($anchorScroll).toHaveBeenCalled();
  });

  it('should not stick on scroll and throw error to return sticky nav false', function() {
    $window.pageYOffset = 550;
    var stickNavAtPosition = 600;

    var nav = new NavigationService(sectionList, stickNavAtPosition);
    nav.scrolledToSection = true;
    nav.scrollToSection();
    expect(nav.scrolledToSection).toEqual(false);
    expect(nav.currentSection).toEqual(undefined);
  });

  it('should scroll to bottom of the document', function() {
    spyOn($window, 'scrollTo');
    var nav = new NavigationService(sectionList, 0);
    nav.scrollToBottom();
    $timeout.flush();
    expect($window.scrollTo).toHaveBeenCalled();
  });

  it('should add section', function() {
    var nav = new NavigationService(sectionList, 0);
    nav.addSection(0, {name: 'newSection', value: 'newSection'});
    expect(nav.sectionList[0].name).toEqual('newSection');
    expect(nav.sectionList[0].value).toEqual('newSection');
  });

  it('should remove section', function() {
    var nav = new NavigationService(sectionList, 0);
    nav.removeSection('offering_review');
    expect(nav.sectionList.length).toEqual(1);
  });
});
