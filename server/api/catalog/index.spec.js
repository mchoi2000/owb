//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.

'use strict';

var proxyquire = require('proxyquire').noCallThru();
var should = require('should');

var mock = {
  getTMTContactModules: 'getTMTContactModules'
};

var expressMock = {
  Router: function() {
    return {
      get: function(path, func) {
        if (path === '/getTMTContactModules') {
          func.should.equal(mock.getTMTContactModules);
        } else {
          should.fail();
        }
      }
    };
  }
};

describe('Catalog - Routes Index', function() {
  it('should create routes', function() {
    proxyquire('./index', {
      express: expressMock,
      './catalog.controller': mock
    });
  });
});
