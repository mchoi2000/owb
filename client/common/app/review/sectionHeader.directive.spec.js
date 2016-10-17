'use strict';

describe('Review Section Directive', function() {
  var compile, scope, element;

  beforeEach(module('common.review', 'common/app/review/sectionHeader.html'));

  beforeEach(inject(function($injector, $compile, $rootScope) {
    compile = $compile;
    scope = $rootScope.$new();
    element = angular.element('<pwb-review-section-header>' +
                              '</pwb-review-section-header>');

    compile(element)(scope);
    scope.$digest();
  }));

  it('should compile', function() {});
});
