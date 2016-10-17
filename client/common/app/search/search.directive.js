//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.search').directive('pwbProductInput', [
    '$timeout',
    '$sce',
    '$sanitize',
    'searchProducts',
    search
  ]);

  function search($timeout, $sce, $sanitize, searchProducts) {
    return {
      restrict: 'E',
      require: '^form',
      scope: {
        label: '@',
        inputName: '@',
        inputId: '@',
        description: '@',
        model: '=',
        isRequired : '=',
        deleteable : '=',
        onDelete: '&',
        placeholder: '@',
        productType: '@?',
        learningLabType: '@?'
      },
      templateUrl: 'common/app/search/search.html',
      transclude: true,
      controller: ['$scope', '$element', function($scope, $element) {
        var self = this;
        var inputElem = $element.find('input')[0];
        var boldPattern = '<strong>$1</strong>';

        self.searchTerm = '';
        self.searchResults = [];
        self.listResults = false;
        self.productFound = false;
        self.resultsFound = false;
        self.searching = false;
        self.allowKeyNav = false;

        self.queryProducts = queryProducts;
        self.resetNotFound = resetNotFound;
        self.checkInput = checkInput;
        self.unselect = unselect;
        self.keyboardSelect = keyboardSelect;
        self.selectProduct = selectProduct;

        self.updateProductView = updateProductView;
        ///////////////////////

        function queryProducts() {
          self.productFound = false;
          self.resultsFound = false;
          self.searchResults = [];
          self.listResults = false;
          $scope.model = '';

          if (self.searchTerm && self.searchTerm !== '') {
            self.searching = true;

            return searchProducts.query(
              self.searchTerm, 6, $scope.productType, $scope.learningLabType
            )
              .then(function resolveProducts(products) {
                if (products.length > 0) {
                  products.forEach(function(product) {
                    var boldRegex = new RegExp('(' + self.searchTerm + ')', 'ig');
                    var html = product.name.replace(boldRegex, boldPattern);
                    product.displayTitle = $sce.trustAsHtml($sanitize(html));
                  });
                  self.searchResults = products;
                  self.resultsFound = true;
                } else {
                  var html = 'No offerings match your entry. Please try again.';
                  self.searchResults = [{
                    displayTitle: $sce.trustAsHtml($sanitize(html))
                  }];
                  self.resultsFound = false;
                }
                self.listResults = true;
                self.searching = false;
              });
          }
        }

        function updateProductView() {
          self.productTitle = $scope.model.name;
          self.productUrl = $scope.model.link;
        }

        function resetNotFound() {
          $scope.formCtrl[$scope.inputName].$setValidity('notFound', true);
        }

        function checkInput($event) {
          self.searching = false;

          // Don't select when user navigates list w/keyboard
          if (self.allowKeyNav) {
            self.allowKeyNav = false;
            return;
          }

          // Result item was likely clicked, let ng-click select product
          if (self.resultsFound && _listItemSelected($event)) {
            return;
          }

          // First result item exactly matches search term; select that
          if (self.resultsFound &&
              self.searchResults.length > 0 &&
              self.searchResults[0].name === self.searchTerm) {
            return selectProduct(self.searchResults[0]);
          }

          // Search for product that exactly matches search term
          if (self.searchTerm && self.searchTerm !== '') {
            return searchProducts.query(self.searchTerm, 1)
              .then(function checkResult(products) {
                if (products.length > 0 && products[0].name === self.searchTerm) {
                  return selectProduct(products[0]);
                } else {
                  $scope.formCtrl[$scope.inputName].$setValidity('notFound', false);
                  self.productFound = false;
                  self.searchResults = [];
                  self.listResults = false;
                }
              });
          }
        }

        $scope.$watch('model', function(newModel) {
          if (newModel === undefined || newModel === '') {
            self.productTitle = '';
            unselect();
          }
          updateProductView();
        });

        function unselect() {
          $scope.model = '';
          self.searchTerm = self.productTitle;
          self.productTitle = '';
          self.productUrl = '';
          self.productFound = false;
          self.resultsFound = false;
          self.listResults = false;
          $timeout(function() { inputElem.focus(); });
          queryProducts();
        }

        function keyboardSelect($event, product) {
          if ($event.which === 13) {
            selectProduct(product);
          } else if ($event.which === 27) {
            $timeout(function() { inputElem.focus(); });
          }
        }

        function selectProduct(product) {
          $scope.model = {
            'product-key': product['product-key'],
            name: product.name,
            link: product.url,
            overview: product['meta-description'],
            description: product['description']
          };
          self.productTitle = product.name;
          self.productUrl = product.url;
          $scope.formCtrl[$scope.inputName].$setValidity('notFound', true);
          self.productFound = true;
          self.searchTerm = '';
          self.searchResults = [];
          self.listResults = false;
        }

        // Result was likely clicked, let ng-click select product
        // Note: Browsers are very iffy on this blur event behavior and how
        // they record the destination element during a blur:
        // - Chrome puts this data in the relatedTarget property.
        // - Safari also uses the relatedTarget property, but provides the <ul> element for some reason
        // - Firefox uses the explicitOriginalTarget property. And sometimes it provides the <a> element
        //   and sometime it provides the text node within the <a> element.
        // - IE/Edge: ?
        function _listItemSelected($event) {
          if ($event.relatedTarget ||
             ($event.originalEvent && $event.originalEvent.explicitOriginalTarget)) {
            var relatedTarget = $event.relatedTarget || $event.originalEvent.explicitOriginalTarget;
            // Handle Firefox indecisiveness
            if (relatedTarget.nodeName === '#text') {
              relatedTarget = relatedTarget.parentElement;
            }

            if (relatedTarget.name === $scope.inputName + '_option' ||
                relatedTarget.id === $scope.inputId + '_list') {
              return true;
            }
          }

          return false;
        }

        function _init() {
          inputElem.addEventListener('keydown', function storeKeyPress(event) {
            if (event.which === 40 && !self.resultsFound) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }

            if (event.which === 40 && self.resultsFound) {
              self.allowKeyNav = true;
            }
          });

          if ($scope.model && $scope.model !== '') {
            self.productTitle = $scope.model.name;
            self.productUrl = $scope.model.link;
            self.productFound = true;
          }

          if ($scope.placeholder && $scope.placeholder !== '') {
            self.placeholder = $scope.placeholder;
          } else {
            self.placeholder = 'Search';
          }
        }

        _init();
      }],
      controllerAs: 'searchCtrl',
      link: function(scope, element, attrs, formCtrl) {
        scope.formCtrl = formCtrl;
      }
    };
  }
})();
