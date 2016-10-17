//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

describe('Product Search Service', function() {
  var $httpBackend;
  var searchProducts;

  beforeEach(module('common.search'));

  beforeEach(inject(function(_$httpBackend_, _searchProducts_) {
    $httpBackend = _$httpBackend_;
    searchProducts = _searchProducts_;
  }));

  it('should query products', function(done) {
    $httpBackend.expectGET('api/diver/queryProducts?limit=6&q=watson')
      .respond({results: {items: [{doc: {name: 'product'}}]}});

    searchProducts.query('watson', 6)
      .then(function(results) {
        expect(results.length).toEqual(1);
        expect(results[0].name).toEqual('product');
        done();
      });

    $httpBackend.flush();
  });

  it('should query products (no results)', function(done) {
    $httpBackend.expectGET('api/diver/queryProducts?limit=6&q=watson')
      .respond({results:{items:[]}});

    searchProducts.query('watson', 6)
      .then(function(results) {
        expect(results.length).toEqual(0);
        done();
      });

    $httpBackend.flush();
  });

  it('should get product', function(done) {
    $httpBackend.expectGET('api/diver/queryProductKey?key=testKey')
      .respond({results: {items: [{doc: {name: 'product'}}]}});

    searchProducts.get('testKey', 6)
      .then(function(result) {
        expect(result.name).toEqual('product');
        done();
      });

    $httpBackend.flush();
  });

  it('should get product (not found)', function(done) {
    $httpBackend.expectGET('api/diver/queryProductKey?key=testKey')
      .respond({results:{items:[]}});

    searchProducts.get('testKey', 6)
      .then(function(result) {
        expect(result).toBeUndefined();
        done();
      });

    $httpBackend.flush();
  });

});
