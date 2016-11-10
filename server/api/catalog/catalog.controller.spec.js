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

describe('Catalog Controller - ', function() {
  beforeEach(function() {
    var self = this;

    self.mockReq = {
      user: {
        _id: 'testUser'
      },

      params: {},
      query: {}
    };

    self.testResp = {id: '', message: 'testMessage'};

    self.mockService = {
      getTMTContactModules: function() {
        return Promise.resolve(self.testResp);
      }
    };

    self.genMockRes = function(expectedStatus, expectedJson, done) {
      let mockRes = {};

      mockRes.status = function(status) {
        status.should.equal(expectedStatus);
        return mockRes;
      };

      mockRes.json = function(json) {
        json.should.eql(expectedJson);
        done();
      };

      return mockRes;
    };

    jasmine.addMatchers({
      toFail: function() {
        return {
          compare: function(actual, expected) {
            return {
              pass: false,
              message: expected
            };
          }
        };
      }
    });
  });

  it('should get all data from Taxonomy TMT API', function(done) {
    let self = this;

    let res = self.genMockRes(200, self.testResp, done);

    let catalogController = proxyquire('./catalog.controller', {
      './catalog.service': self.mockService
    });

    catalogController.getTMTContactModules(self.mockReq, res);
  });

  it('should fail to get data from Taxonomy TMT API', function(done) {
    let self = this;

    self.testResp = {reason: 'Server Error'};

    self.mockService = {
      getTMTContactModules: function() {
        return Promise.reject({statusCode: 502, message: 'Bad Gateway'});
      }
    };

    let res = self.genMockRes(500, self.testResp, done);

    let catalogController = proxyquire('./catalog.controller', {
      './catalog.service': self.mockService
    });

    catalogController.getTMTContactModules(self.mockReq, res);
  });
});
