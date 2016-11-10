//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.

'use strict';

/* jshint unused: false */
var proxyquire = require('proxyquire').noCallThru();
var should = require('should');
var sampleAPIResponse = {};
const Errors = require('../../components/utils').Errors;

describe('Catalog Service - ', function() {
  it('should get Contact Modules from Taxonomy API', function(done) {
    let sampleTMTResponse = {
      _items: [
        {
          '_relation_codes': {
            narrower: [
              {node: 'Blockchain'},
              {node: 'DeveloperWorks Premium'},
              {node: 'Learning Lab (Support)'},
              {node: 'Cross IBM'},
              {node: 'MSP/CSP'}
            ]
          },
          _id: 'Miscellaneous'
        },
        {
          '_relation_codes': {
            narrower: [
              {node: 'All'}
            ]
          },
          _id: 'Industry'
        }
      ]
    };
    let service = proxyquire('./catalog.service', {
      request: function(options, callback) {
        options.url.indexOf('https://w3.api.ibm.com/common/run/taas/taxonomies' +
          '/2444/broadest_nodes?client_id=').should.be.exactly(0);
        callback(null, {statusCode: 200, body: JSON.stringify(sampleTMTResponse)});
      }
    });
    service.getTMTContactModules()
      .then(function(response) {
        response.should.deepEqual({
          Miscellaneous: [
            'Blockchain',
            'DeveloperWorks Premium',
            'Learning Lab (Support)',
            'Cross IBM',
            'MSP/CSP'
          ],
          Industry: ['All']
        });
        done();
      })
      .catch(function (reason) {
        expect().toFail(reason.toString());
        done();
      });
  });

  it('should error to get Contact Modules from Taxonomy API', function(done) {
    let service = proxyquire('./catalog.service', {
      request: function(options, callback) {
        options.url.indexOf('https://w3.api.ibm.com/common/run/taas/taxonomies' +
          '/2444/broadest_nodes?client_id=').should.be.exactly(0);
        callback(null, {statusCode: 502, body: JSON.stringify({reason: 'Bad Gateway'})});
      }
    });
    service.getTMTContactModules()
      .then(function(response) {
        expect().toFail(response.toString());
        done();
      })
      .catch(function (error) {
        expect(error.statusCode).toEqual(502);
        expect(error.message.reason).toEqual('Bad Gateway');
        done();
      });
  });
});
