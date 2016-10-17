'use strict';

describe('Select Component', function() {
  var $compile;
  var $rootScope;
  var $componentController;

  beforeEach(angular.mock.module('common.input', 'common/app/input/select.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$componentController_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $componentController = _$componentController_;
  }));

  it('should check if too few are selected', function() {
    $componentController = $componentController('pwbSelectInput', null, {
        inputName: 'test',
        model: []
    });
      $componentController.formCtrl = {
          test: {
              $setValidity: function(one, two){}
          }
      };

      spyOn($componentController.formCtrl['test'], '$setValidity');

      $componentController.$onChanges({model: ['test']}, {}, {
        inputName: 'test',
        minSelect: 2
    });

    expect($componentController.formCtrl['test'].$setValidity)
        .toHaveBeenCalledWith('tooFewSelected', false);
  });

  it('should check if too many are selected', function() {
    $componentController = $componentController('pwbSelectInput', null, {
        inputName: 'test',
        maxSelect: 2,
        minSelect: 1,
        model: []
    });

    $componentController.formCtrl = {
        test: {
            $setValidity: function(one, two){}
        }
    };

    spyOn($componentController.formCtrl['test'], '$setValidity');

      $componentController.$onChanges({model: ['test', 'test', 'test']});

      expect($componentController.formCtrl['test'].$setValidity)
          .toHaveBeenCalledWith('tooManySelected', true);
  });

    it('should initialize component with no props', function() {
        $componentController = $componentController('pwbSelectInput', null, {
            inputName: 'test',
            model: [],
            optionList: []
        });

        $componentController.$onInit();

        expect($componentController.minSelect).toBe(0);
        expect($componentController.maxSelect).toBe(1);
    });

    it('should initialize component', function() {
        $componentController = $componentController('pwbSelectInput', null, {
            inputName: 'test',
            model: [],
            optionList: [],
            minSelect: 1,
            maxSelect: 3
        });

        $componentController.$onInit();

        expect($componentController.minSelect).toBe(1);
        expect($componentController.maxSelect).toBe(3);

        $componentController.$onChanges({});
    });

    it('should run post link on component', function() {
        $componentController = $componentController('pwbSelectInput', null, {
            inputName: 'test',
            optionList: [],
            minSelect: 1,
            maxSelect: 3
        });

        spyOn($componentController, 'checkValid');

        $componentController.$postLink();
        $componentController.model = [];
        $componentController.$postLink();

        expect($componentController.checkValid).toHaveBeenCalledTimes(1);
    });
});
