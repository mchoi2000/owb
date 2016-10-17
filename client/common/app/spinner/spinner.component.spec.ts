'use strict';

describe('Loading Spinner Component', function() {
  var $compile;
  var $rootScope;

  beforeEach(angular.mock.module('common.spinner', 'common/app/spinner/spinner.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should compile', function() {
    var scope = $rootScope.$new();
    var element = angular.element('<pwb-spinner></pwb-spinner>');

    $compile(element)(scope);
    scope.$digest();
  });
});
