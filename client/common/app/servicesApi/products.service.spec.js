'use strict';

describe('ProductsFactory', function () {
  var serviceProductsFactory;
  var $httpBackend;

  beforeEach(module('common.product'));

  beforeEach(module(function($provide) {
    $provide.value('Upload', {upload: function() {}, json: function() {}});
  }));

  beforeEach(inject(function(_$httpBackend_, ProductsFactory) {
    $httpBackend = _$httpBackend_;
    serviceProductsFactory = ProductsFactory;
  }));

  it('should getByQualificationStatus', function() {
    serviceProductsFactory.getByQualificationStatus('testStatus');
  });

  it('should get qualifications by query', function() {
    serviceProductsFactory.getQualificationsByQuery('testParam1=testValue1&testParam2=testValue2');
  });

  it('should query products (null)', function() {
    serviceProductsFactory.getQualificationsByQuery({id: ''});
  });

  it('should getByCmcStatus', function() {
    serviceProductsFactory.getByCmcStatus('testStatus');
  });

  it('should getQualification', function() {
    serviceProductsFactory.getQualification('testId');
  });

  it('should getProduct', function() {
    serviceProductsFactory.getProduct('testId');
  });

  it('should getProduct', function() {
    serviceProductsFactory.getProductAtRev('testId', 'testRev');
    $httpBackend.expectGET('api/products/testId?rev=testRev').respond(200, {data: {}});
    $httpBackend.flush();
    serviceProductsFactory.getProductAtRev('testId', 'testRev');
    $httpBackend.expectGET('api/products/testId?rev=testRev').respond(404, 'Not Found');
    $httpBackend.expectGET('api/products/testId').respond(200, {data: {}});
    $httpBackend.flush();
  });

  it('should getContent', function(done) {
    $httpBackend.expectGET('api/products/content/testId')
      .respond({id: 'testId'});

    serviceProductsFactory.getContent('testId')
      .then(function resolve(content) {
        expect(content.id).toEqual('testId');
        done();
      });

    $httpBackend.flush();
  });

  it('should getByUser', function() {
    serviceProductsFactory.getByUser();
  });

  it('should submitQualification', function() {
    serviceProductsFactory.submitQualification({});
  });

  it('should deleteProduct', function() {
    serviceProductsFactory.deleteProduct('testId');
  });

  it('should restoreProduct', function() {
    serviceProductsFactory.restoreProduct('testId');
  });

  it('should saveIntegration', function() {
    serviceProductsFactory.saveIntegration('true', {});
  });

  it('should getBPC', function() {
    serviceProductsFactory.getBPC('testId');
  });

  it('should launchBPCTests', function() {
    serviceProductsFactory.launchBPCTests('testId');
  });

  it('should pollTestResults', function() {
    serviceProductsFactory.pollTestResults('testId');
  });

  it('should save commerce', function() {
    serviceProductsFactory.saveCommerce('testId', 'testRev', {});
  });

  it('should submit commerce', function() {
    serviceProductsFactory.submitCommerce('testId', 'testRev', {});
  });

  it('should approve commerce', function() {
    serviceProductsFactory.approveCommerce('testId');
  });

  it('should approve special commerce', function() {
    serviceProductsFactory.approveSpecialCommerce('testId', []);
  });

  it('should return commerce', function() {
    serviceProductsFactory.returnCommerce('testId', [], '');
  });

  it('should save parts', function() {
    serviceProductsFactory.saveParts('testId', []);
  });

  it('should save content', function() {
    serviceProductsFactory.saveContent('testId', {}, [], {});
  });

  it('should submit content', function() {
    serviceProductsFactory.submitContent('testId', {}, [], {});
  });

  it('should publish cognitive', function() {
    serviceProductsFactory.publishCognitive('testId', {}, [], {});
  });

  it('should get content by id', function(done) {
    $httpBackend.expectGET('api/products/getByContentId/testId')
      .respond({id: 'testId'});
    serviceProductsFactory.getByContentId('testId', 'rev').then(function(res) {
      expect(res.data).toEqual({id: 'testId'});
      done();
    });
    $httpBackend.flush();
  });

  it('should upload translations', function(done) {
    $httpBackend
    .expectPOST('api/products/uploadTranslations', {testID: {'fr-fr': 'frenchtranslation'}})
    .respond(200, {id:['testID']});
    serviceProductsFactory.uploadTranslations({testID: {'fr-fr': 'frenchtranslation'}})
    .then(function(res) {
      expect(res.data).toEqual({id:['testID']});
      done();
    });
    $httpBackend.flush();
  });
});
