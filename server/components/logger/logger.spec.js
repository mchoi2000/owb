//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

/* jshint unused: false */
var proxyquire = require('proxyquire').noCallThru();
var loggerController = require('./logger.controller');
var should = require('should');

describe('Logger Controller', function() {
  it('should send log with null product', function(done) {
    var retVal = loggerController.toLogString('testUserId', 'testAction',
                                                          null, 'id', 'testStatus');
    expect(retVal).toEqual('USER=testUserId - action=testAction - product=N/A - productId=id' +
                           ' - status=testStatus');
    done();
  });

  it('should send log with no null values', function(done) {
    var retVal = loggerController.toLogString('testUserId', 'testAction',
                                                          'testProduct', 'id', 'testStatus');
    expect(retVal).toEqual('USER=testUserId - action=testAction - product=testProduct' +
                           ' - productId=id - status=testStatus');
    done();
  });

  it('should send log with null product id', function(done) {
    var retVal = loggerController.toLogString('testUserId', 'testAction',
                                                          'testProduct', null, 'testStatus');
    expect(retVal).toEqual('USER=testUserId - action=testAction - product=testProduct - ' +
                           'productId=N/A - status=testStatus');
    done();
  });
});
