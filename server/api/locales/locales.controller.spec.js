//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

var countryController = require('./locales.controller');
var proxyquire = require('proxyquire').noCallThru();

describe('country controller', function() {
  it('get locales with names', function() {
    var req = {};
    var res = {
      status: function(status) {
        status.should.equal(200);
      },
      json: function() {
      }
    };
    countryController.getCountriesWithLang(req, res);
  });

  it('fail when sevenseas locale not loaded', function() {
    var _countryController = proxyquire('./locales.controller', {
      '../../../node_modules/@marketplace/sevenseas' : {
        getWCMLanguageAndViewMap : function() {
          return;
        }
      },
      '../../../node_modules/@marketplace/i18n-support' : {
      }
    });
    var req = {
      test : true
    };
    var res = {
      status: function(status) {
        status.should.equal(404);
      },
      json: function() {
      }
    };
    _countryController.getCountriesWithLang(req, res);
  });
});
