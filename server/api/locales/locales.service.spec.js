//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
/* jshint unused: false */
let proxyquire = require('proxyquire').noCallThru();
var showError = false;

function mockRequest(params, cb) {
  if (showError) {
    cb('err');
  }
  else {
    cb(null, {statusCode: 200}, '{}');
  }
}

let service = proxyquire('./locales.service', {
  'request': mockRequest
});

describe('Locale service', function() {
  it('should get offerings from pwb', function(done) {
    service.getOfferingsByLanguage('frca').then(function(res) {
      expect(res).toEqual({});
      done();
    });
  });

  it('should error while getting offerings from pwb', function(done) {
    showError = true;
    service.getOfferingsByLanguage('frca').catch(function(err) {
      expect(err).toEqual('err');
      done();
    });
  });
});
