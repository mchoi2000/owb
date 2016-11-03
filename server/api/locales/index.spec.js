/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */
'use strict';
var proxyquire = require('proxyquire').noCallThru();
var should = require('should');

var ctrlMock = {
  getCountriesWithLang: 'getCountriesWithLang'
};

var expressMock = {
  Router: function() {
    return {
      get: function(path, auth, func) {
        if (func === undefined) {
          func = auth;
        }
        if (path === '/') {
          func.should.equal(ctrlMock.getCountriesWithLang);
        } else {
          should.fail();
        }
      }
    };
  }
};

describe('locales service index', function() {
  it('should create locales', function () {
    proxyquire('./index', {
      express: expressMock,
      './locales.controller': ctrlMock
    });
  });
});
