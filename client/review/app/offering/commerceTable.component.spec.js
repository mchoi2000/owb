'use strict';

describe('Commerce Table component', function() {
  var compile, scope, element;

  beforeEach(module('review.offering', 'review/app/offering/commerceTable.html'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    scope = $rootScope.$new();

    scope.testPlans = [{planDetails: [{},{},{}]}];

    element = angular.element('<pwb-commerce-table ' +
                                'plans="testPlans">' +
                              '</pwb-commerce-table>');

    compile(element)(scope);
    scope.$digest();
  }));

  it('should compile', function() {
    var dirScope = element.isolateScope();
    expect(dirScope.$ctrl.maxDetails.length).toEqual(3);
    scope.testPlans = undefined;
    scope.$digest();
  });
});
