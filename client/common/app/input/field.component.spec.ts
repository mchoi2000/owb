'use strict';

describe('Field Component', function() {
  var $compile;
  var $rootScope;

  beforeEach(angular.mock.module('common.input', 'common/app/input/field.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should compile', function() {
    var scope = $rootScope.$new();
    var element = angular.element('<pwb-input-field></pwb-input-field>');

    $compile(element)(scope);
    scope.$digest();
  });
});
