'use strict';

describe('Scroller', function () {
  var mockWindow = {
    addEventListener: function(eventName, callback) {
      expect(eventName).toBe('scroll');
      callback();
    },
    removeEventListener: function(eventName) {
      expect(eventName).toBe('scroll');
    },
    innerHeight: 0,
    pageYOffset: 0
  };
  var scroller;

  beforeEach(module('common.scroller', function($provide) {
    $provide.value('$window', mockWindow);
  }));

  beforeEach(inject(function(Scroller) {
    scroller = Scroller;
  }));

  it('listen to scroll events', function() {
    scroller.onDocumentEnd(function() {
    });
  });

  it('invoke callback if end of document', function() {
    mockWindow.innerHeight = 500;
    mockWindow.pageYOffset = 250;
    scroller.onDocumentEnd(function() {
    });
  });

  it('should remove handler', function() {
    scroller.removeDocumentEndHandler();
  });
});
