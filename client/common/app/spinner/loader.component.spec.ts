'use strict';

describe('Loading Spinner Component', function() {
    var controller;

    beforeEach(angular.mock.module('common.spinner'));

    beforeEach(inject(function($componentController) {
        controller = $componentController('loader', {});
    }));

    it('should compile', function() {
        expect(controller).toBeDefined();
    });
});
