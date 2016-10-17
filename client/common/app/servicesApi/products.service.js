//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.product', ['ngFileUpload']);

  angular.module('common.product').factory('ProductsFactory', ['$http', 'Upload', '$q',
    ProductsFactory]);

  /*jshint maxstatements: 50 */
  function ProductsFactory($http, Upload, $q) {
    var baseProductsURL = 'api/products';
    var baseIntegrationURL = 'api/integration';

    var productsFactory = {
      getByQualificationStatus: getByQualificationStatus,
      getQualificationsByQuery: getQualificationsByQuery,
      getCount: getCount,
      getByCmcStatus: getByCmcStatus,
      getQualification: getQualification,
      getProduct: getProduct,
      getProductAtRev: getProductAtRev,
      getContent: getContent,
      getByContentId: getByContentId,
      getByUser: getByUser,
      getTranslateDocs: getTranslateDocs,
      submitQualification: submitQualification,
      deleteProduct: deleteProduct,
      restoreProduct: restoreProduct,
      saveIntegration: saveIntegration,
      saveContent: saveContent,
      submitContent: submitContent,
      saveCommerce: saveCommerce,
      submitCommerce: submitCommerce,
      approveCommerce: approveCommerce,
      approveSpecialCommerce: approveSpecialCommerce,
      returnCommerce: returnCommerce,
      saveParts: saveParts,
      getBPC: getBPC,
      launchBPCTests: launchBPCTests,
      pollTestResults: pollTestResults,
      uploadTranslations: uploadTranslations,
      publishCognitive: publishCognitive
    };

    function getByQualificationStatus(productStatus) {
      return $http.get('api/qualifications/getByStatus?status=' + productStatus);
    }

    function getQualificationsByQuery(queryObject) {
      var query = buildQuery(queryObject);
      return $http.get('api/qualifications/query/qualReview?' + query);
    }

    function getCount(queryObject) {
      var query = buildQuery(queryObject);
      return $http.get('api/qualifications/query/count?' + query);
    }

    function getByCmcStatus(productStatus, specialistRequired, marketplaceReviewerApproved) {
      if (specialistRequired === undefined && marketplaceReviewerApproved === undefined) {
        return $http.get(baseProductsURL + '/getByCmcStatus?status=' + productStatus);
      } else {
        return $http.get(baseProductsURL + '/getByCmcStatus?status=' +
          productStatus + '&specialistRequired=' + specialistRequired +
          '&marketplaceReviewerApproved=' + marketplaceReviewerApproved);
      }

    }

    function getQualification(id) {
      return $http.get('api/qualifications/' + id);
    }

    function getProduct(id) {
      return $http.get(baseProductsURL + '/' + id);
    }

    function getProductAtRev(id, rev) {
      return $http.get(baseProductsURL + '/' + id + '?rev=' + rev)
        .then(resolveRevision, rejectRevision);
      function resolveRevision(revResponse) {
        return $q.resolve(revResponse.data);
      }
      function rejectRevision(error) {
        return getProduct(id)
        .then(function (response) {
          return $q.resolve(response.data);
        });
      }
    }

    function getByUser() {
      return $http.get(baseProductsURL + '/byUser');
    }

    function getContent(id) {
      return $http.get(baseProductsURL + '/content/' + id)
        .then(function resolveResponse(response) {
          return response.data;
        });
    }

    function getByContentId(id) {
      return $http.get(baseProductsURL + '/getByContentId/' + id);
    }

    function submitQualification(product) {
      return $http.post('api/qualifications/submitQualification', product);
    }

    function deleteProduct(id) {
      return $http.delete(baseProductsURL + '/' + id);
    }

    function restoreProduct(id) {
      return $http.post(baseProductsURL + '/restore/' + id);
    }

    function saveContent(id, content, images, countryMktConfig) {
      return Upload.upload({
        method: 'POST',
        url: baseProductsURL + '/saveContent/' + id,
        data: {
          content: Upload.json(content),
          images: images,
          marketConfig: Upload.json(countryMktConfig)
        }
      });
    }

    function submitContent(id, content, images, countryMktConfig) {
      return Upload.upload({
        method: 'POST',
        url: baseProductsURL + '/submitContent/' + id,
        data: {
          content: Upload.json(content),
          images: images,
          marketConfig: Upload.json(countryMktConfig)
        }
      });
    }

    function saveIntegration(markComplete, configData) {
      return $http.post(baseIntegrationURL +
        '/saveIntegration?markComplete=' + markComplete, configData);
    }

    function saveCommerce(productId, productRevision, commerceData) {
      return $http.post(baseProductsURL +  '/saveCommerce/' + productId +
        '?rev=' + productRevision, commerceData);
    }

    function submitCommerce(productId, productRevision, commerceData) {
      return $http.post(baseProductsURL +  '/submitCommerce/' + productId +
        '?rev=' + productRevision, commerceData);
    }

    function approveCommerce(productId) {
      return $http.post(baseProductsURL + '/approveCommerce/' + productId);
    }

    function approveSpecialCommerce(productId, partsList) {
      return $http.post(baseProductsURL + '/specialist/approveCommerce/' + productId, {
        partsList: partsList
      });
    }

    function returnCommerce(productId, partsList, reviewComments) {
      return $http.post(baseProductsURL + '/returnCommerce/' + productId, {
        returnComments: reviewComments,
        partsList: partsList
      });
    }

    function saveParts(productId, partsList) {
      return $http.post(baseProductsURL + '/savePartsList/' + productId, {
        partsList: partsList
      });
    }

    function getBPC(productId) {
      return $http.get(baseIntegrationURL +  '/getBPC/' + productId);
    }

    function getTranslateDocs() {
      return $http.get('api/translation/getTranslateDocs');
    }

    function launchBPCTests(productId) {
      return $http.get(baseIntegrationURL +  '/launchBPCTests/' + productId);
    }

    function pollTestResults(backplaneId) {
      return $http.get(baseIntegrationURL +  '/pollTestResults/' + backplaneId);
    }

    function uploadTranslations(content) {
      return $http.post(baseProductsURL +  '/uploadTranslations', content);
    }

    //TODO: Cognitive Phase 2: Use normal save/submit content endpoints
    function publishCognitive(id, content, countryMktConfig) {
      var body = {
        content: content,
        marketConfig: countryMktConfig
      };

      return $http.post(baseProductsURL + '/publishCognitive/' + id, body);
    }

    function buildQuery(queryObject) {
      var keyValuePairs = [];
      var query = '';
      for (var key in queryObject) {
        if (queryObject[key] !== null &&
            queryObject[key] !== undefined &&
            queryObject[key] !== '') {
          keyValuePairs.push(key + '=' + queryObject[key]);
        }
      }
      query = keyValuePairs.join('&');
      return query;
    }

    return productsFactory;
  }
})();
