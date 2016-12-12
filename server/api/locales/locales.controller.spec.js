//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
/* jshint unused: false */
var proxyquire = require('proxyquire').noCallThru();
var showError = false;

var mockLocalesService = {
  getOfferingsByLanguage: function(lang) {
    if (showError) {
      return Promise.reject({});
    } else {
      return Promise.resolve({});
    }
  }
};

var localeCtrl = proxyquire('./locales.controller', {
  './locales.service': mockLocalesService
});

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
    localeCtrl.getCountriesWithLang(req, res);
  });

  it('fail when sevenseas locale not loaded', function() {
    var _localeCtrl = proxyquire('./locales.controller', {
      '@marketplace/sevenseas' : {
        getWCMLanguageAndViewMap : function() {
          return;
        }
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
    _localeCtrl.getCountriesWithLang(req, res);
  });

  it('should get offerings by language', function() {
    var req = {
      params: {
        language: 'frca'
      }
    };
    var res = {
      status: function(status) {
        status.should.equal(200);
      },
      json: function() {
      }
    };
    localeCtrl.getOfferingsByLanguage(req, res);
  });

  it('should throw error if language is not defined', function() {
    var req = {
      params: {
      }
    };
    var res = {
      status: function(status) {
        status.should.equal(400);
        return this;
      },
      json: function() {
      }
    };
    localeCtrl.getOfferingsByLanguage(req, res);
  });
});
