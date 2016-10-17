//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
describe('Product Search Directive', function() {
  var $q;
  var $compile;
  var $rootScope;
  var $timeout;
  var searchProducts;

  beforeEach(module('common.search', 'common/app/search/search.html'));

  beforeEach(inject(function(_$q_, _$compile_, _$rootScope_, _$timeout_, _searchProducts_) {
    $q = _$q_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;

    $rootScope.testArray = ['', ''];

    searchProducts = _searchProducts_;
  }));

  it('should compile directive', function() {
    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    expect(controller.searchTerm).toEqual('');
    expect(controller.searchResults.length).toEqual(0);
    expect(controller.listResults).toEqual(false);
    expect(controller.productFound).toEqual(false);
    expect(controller.resultsFound).toEqual(false);
    expect(controller.searching).toEqual(false);

    expect(scope.inputName).toEqual('testName');
    expect(scope.model).toEqual('');
  });

  it('should search products', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([{
      name: 'Watson Analytics'
    },{
      name: 'Watson Dianetics'
    },{
      name: 'Watson Translate'
    },{
      name: 'Watson Magic'
    },{
      name: 'Watson Crick'
    },{
      name: 'Watson Schmatson'
    }]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'Watson';
    controller.queryProducts();

    scope.$apply();

    expect(searchProducts.query).toHaveBeenCalledWith('Watson', 6, undefined, undefined);
    expect(controller.resultsFound).toEqual(true);
    expect(controller.listResults).toEqual(true);
    expect(controller.searching).toEqual(false);
    expect(controller.productFound).toEqual(false);
    expect(controller.searchResults.length).toEqual(6);
    expect(controller.searchResults[0].displayTitle.$$unwrapTrustedValue())
      .toEqual('<strong>Watson</strong> Analytics');
    expect(controller.searchResults[1].displayTitle.$$unwrapTrustedValue())
      .toEqual('<strong>Watson</strong> Dianetics');
    expect(controller.searchResults[2].displayTitle.$$unwrapTrustedValue())
      .toEqual('<strong>Watson</strong> Translate');
    expect(controller.searchResults[3].displayTitle.$$unwrapTrustedValue())
      .toEqual('<strong>Watson</strong> Magic');
    expect(controller.searchResults[4].displayTitle.$$unwrapTrustedValue())
      .toEqual('<strong>Watson</strong> Crick');
    expect(controller.searchResults[5].displayTitle.$$unwrapTrustedValue())
      .toEqual('<strong>Watson</strong> Schmatson');
  });

  it('should search products (no results)', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'crazytown';
    controller.queryProducts();

    scope.$apply();

    expect(searchProducts.query).toHaveBeenCalledWith('crazytown', 6, undefined, undefined);
    expect(controller.resultsFound).toEqual(false);
    expect(controller.listResults).toEqual(true);
    expect(controller.searching).toEqual(false);
    expect(controller.productFound).toEqual(false);
    expect(controller.searchResults.length).toEqual(1);
    expect(controller.searchResults[0].displayTitle.$$unwrapTrustedValue())
      .toEqual('No offerings match your entry. Please try again.');
  });

  it('should search products (no input)', function() {
    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');

    controller.queryProducts();

    expect(controller.searching).toEqual(false);
  });

  it('should check input (allow keyboard nav)', function() {
    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');

    controller.searching = true;
    controller.allowKeyNav = true;
    controller.checkInput({});

    expect(controller.searching).toEqual(false);
    expect(controller.allowKeyNav).toEqual(false);
  });

  it('should check input (select result (Chrome))', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([{
      'product-key': 'testKey',
      url: 'http://test.com',
      name: 'Watson Analytics'
    }]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'Watson';
    controller.queryProducts();

    scope.$apply();

    controller.checkInput({
      relatedTarget: {
        id: '0',
        name: scope.inputName + '_option'
      }
    });

    expect(controller.productFound).toEqual(false);
  });

  it('should check input (select result (Firefox))', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([{
      'product-key': 'testKey',
      url: 'http://test.com',
      name: 'Watson Analytics'
    }]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'Watson';
    controller.queryProducts();

    scope.$apply();

    controller.checkInput({
      originalEvent: {
        explicitOriginalTarget: {
          id: '0',
          name: scope.inputName + '_option'
        }
      }
    });

    expect(controller.productFound).toEqual(false);
  });

  it('should check input (select result (Firefox text node))', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([{
      'product-key': 'testKey',
      url: 'http://test.com',
      name: 'Watson Analytics'
    }]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'Watson';
    controller.queryProducts();

    scope.$apply();

    controller.checkInput({
      originalEvent: {
        explicitOriginalTarget: {
          nodeName: '#text',
          parentElement: {
            id: '0',
            name: scope.inputName + '_options'
          }
        }
      }
    });

    expect(controller.productFound).toEqual(false);
  });

  it('should check input (select result (Safari))', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([{
      'product-key': 'testKey',
      url: 'http://test.com',
      name: 'Watson Analytics'
    }]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'Watson';
    controller.queryProducts();

    scope.$apply();

    controller.checkInput({
      relatedTarget: {
        id: '0',
        name: scope.inputName + '_list'
      }
    });

    expect(controller.productFound).toEqual(false);
  });

  it('should check input (exact result match)', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([{
      'product-key': 'testKey',
      url: 'http://test.com',
      name: 'Watson Analytics',
      'meta-description': 'Watson Analytics',
      description: 'Watson Analytics description'
    }]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'Watson Analytics';
    controller.queryProducts();

    scope.$apply();

    controller.checkInput({originalEvent: {}});
    scope.$digest();

    expect(scope.model).toEqual({
      'product-key': 'testKey',
      name: 'Watson Analytics',
      link: 'http://test.com',
      overview: 'Watson Analytics',
      description: 'Watson Analytics description'
    });
    expect(controller.productTitle).toEqual('Watson Analytics');
    expect(controller.productUrl).toEqual('http://test.com');
    expect(controller.productFound).toEqual(true);
    expect(controller.searchResults.length).toEqual(0);
    expect(controller.listResults).toEqual(false);
    expect(scope.formCtrl.testName.$valid).toEqual(true);
  });

  it('should check input (exact search match)', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([{
      'product-key': 'testKey',
      url: 'http://test.com',
      name: 'Watson Analytics',
      'meta-description': 'Watson Analytics',
      description: 'Watson Analytics description'
    }]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'Watson Analytics';

    controller.checkInput({originalEvent: {}});
    scope.$apply();

    expect(scope.model).toEqual({
      'product-key': 'testKey',
      name: 'Watson Analytics',
      link: 'http://test.com',
      overview: 'Watson Analytics',
      description: 'Watson Analytics description'
    });
    expect(controller.productTitle).toEqual('Watson Analytics');
    expect(controller.productUrl).toEqual('http://test.com');
    expect(controller.productFound).toEqual(true);
    expect(controller.searchResults.length).toEqual(0);
    expect(controller.listResults).toEqual(false);
    expect(scope.formCtrl.testName.$valid).toEqual(true);
  });

  it('should check input (product not found)', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'Watson Analytics';

    controller.checkInput({originalEvent: {}});
    scope.$apply();

    expect(scope.formCtrl.testName.$valid).toEqual(false);
    expect(controller.productFound).toEqual(false);
    expect(controller.searchResults.length).toEqual(0);
    expect(controller.listResults).toEqual(false);
  });

  it('should check input (empty input)', function() {
    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');

    controller.checkInput({originalEvent: {}});

    expect(controller.searching).toEqual(false);
  });

  it('should reset not found error', function() {
    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    scope.formCtrl.testName.$setValidity('notFound', false);

    controller.resetNotFound();
    expect(scope.formCtrl.testName.$$success.notFound).toEqual(true);
  });

  it('should unselect product', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([{
      'product-key': 'testKey',
      url: 'http://test.com',
      name: 'Watson Analytics'
    }]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'Watson';
    controller.queryProducts();

    scope.$apply();

    controller.checkInput({
      relatedTarget: {
        id: '0',
        name: scope.inputName + '_option'
      }
    });
    controller.selectProduct({
      'product-key': 'testKey',
      url: 'http://test.com',
      name: 'Watson Analytics'
    });

    controller.unselect();
    scope.$apply();
    $timeout.flush();

    expect(scope.model).toEqual('');
    expect(controller.searchTerm).toEqual('Watson Analytics');
    expect(controller.productTitle).toEqual('');
    expect(controller.productUrl).toEqual('');
    expect(controller.productFound).toEqual(false);

    expect(controller.listResults).toEqual(true);
    expect(controller.resultsFound).toEqual(true);
  });

  it('should keyboard select', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([{
      'product-key': 'testKey',
      url: 'http://test.com',
      name: 'Watson Analytics',
      'meta-description': 'Watson Analytics',
      description: 'Watson Analytics description'
    }]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'Watson';
    controller.queryProducts();

    scope.$apply();

    controller.keyboardSelect({which: 13}, {
      'product-key': 'testKey',
      url: 'http://test.com',
      name: 'Watson Analytics',
      'meta-description': 'Watson Analytics',
      description: 'Watson Analytics description'
    });
    scope.$digest();

    expect(scope.model).toEqual({
      'product-key': 'testKey',
      name: 'Watson Analytics',
      link: 'http://test.com',
      overview: 'Watson Analytics',
      description: 'Watson Analytics description'
    });
    expect(controller.productTitle).toEqual('Watson Analytics');
    expect(controller.productUrl).toEqual('http://test.com');
    expect(controller.productFound).toEqual(true);
    expect(controller.searchResults.length).toEqual(0);
    expect(controller.listResults).toEqual(false);
    expect(scope.formCtrl.testName.$valid).toEqual(true);
  });

  it('should escape keyboard nav', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([{
      'product-key': 'testKey',
      url: 'http://test.com',
      name: 'Watson Analytics'
    }]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'Watson';
    controller.queryProducts();

    scope.$apply();

    controller.keyboardSelect({which: 27});
    $timeout.flush();
  });

  it('should ignore other key presses', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([{
      'product-key': 'testKey',
      url: 'http://test.com',
      name: 'Watson Analytics'
    }]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'Watson';
    controller.queryProducts();

    scope.$apply();

    controller.keyboardSelect({which: 0});
    $timeout.flush();
  });

  it('should load product', function() {
    $rootScope.testArray[0] = {
      'product-key': 'testKey',
      link: 'http://test.com',
      name: 'Watson Analytics'
    };
    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();
    scope.$apply();

    expect(controller.productFound).toEqual(true);
    expect(controller.productUrl).toEqual('http://test.com');
    expect(controller.productTitle).toEqual('Watson Analytics');
  });

  it('should prevent input check on keyboard nav', function() {
    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);

    var input = searchDirective.find('input')[0];
    var evt = new Event('keydown');
    evt.which = 40;
    spyOn(evt, 'preventDefault');
    spyOn(evt, 'stopPropagation');
    input.dispatchEvent(evt);

    expect(evt.preventDefault).toHaveBeenCalled();
    expect(evt.stopPropagation).toHaveBeenCalled();
  });

  it('should allow key nav', function() {
    var defer = $q.defer();
    spyOn(searchProducts, 'query').and.returnValue(defer.promise);
    defer.resolve([{
      'product-key': 'testKey',
      url: 'http://test.com',
      name: 'Watson Analytics'
    }]);

    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');
    var scope = searchDirective.isolateScope();

    controller.searchTerm = 'Watson';
    controller.queryProducts();

    scope.$apply();

    var input = searchDirective.find('input')[0];
    var evt = new Event('keydown');
    evt.which = 40;
    input.dispatchEvent(evt);

    expect(controller.allowKeyNav).toEqual(true);
  });

  it('should ignore keydown event', function() {
    var element = $compile(genHtml(0))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);

    var input = searchDirective.find('input')[0];
    var evt = new Event('keydown');
    evt.which = 41;
    input.dispatchEvent(evt);
  });

  it('should initialize placeholder to search if not passed', function() {
    var element = $compile(genHtml(0).replace(/placeholder=".+?"/, ''))($rootScope);
    $rootScope.$digest();
    var searchDirective = angular.element(element.find('pwb-product-input')[0]);
    var controller = searchDirective.controller('pwbProductInput');

    controller.checkInput({originalEvent: {}});

    expect(controller.searching).toEqual(false);
  });

  function genHtml(index) {
    return '<form name="contentForm">' +
             '<pwb-product-input ' +
               'label="testLabel" ' +
               'input-id="testId" ' +
               'input-name="testName" ' +
               'index="' + index + '" ' +
               'model="testArray[' + index + ']" ' +
               'is-required="true" ' +
               'deleteable="true" ' +
               'placeholder="Search for a product" ' +
              '</pwb-product-input>' +
            '</form>';
  }
});
