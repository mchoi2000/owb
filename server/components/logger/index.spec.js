//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

var should = require('should');
var container = require('./index');
var proxyquire = require('proxyquire').noCallThru();

describe('Logger', function() {

  it('should configure access logger', function(done) {
    var logger = container.get('access');
    should.exist(logger);
    done();
  });

  it('should configure security logger', function(done) {
    var logger = container.get('security');
    should.exist(logger);
    done();
  });

  it('should configure app logger', function(done) {
    var logger = container.get('app');
    should.exist(logger);
    done();
  });

  it('should configure db logger', function(done) {
    var logger = container.get('db');
    should.exist(logger);
    done();
  });

  it('should configure with file transport', function(done) {
    var logger = proxyquire('./index', {
      '../../config/environment': {
        logging: {
          silent: false,
          dir: './.tmp/logs',
          categories: {
            app: ['File', 'Unknown']
          }
        }
      }
    }).get('app');
    should.exist(logger);
    done();
  });

  it('should configure with Logentries', function(done) {
    var logger = proxyquire('./index', {
      '../../config/environment': {
        // fake logentries token
        logentriesToken: 'c6b1a130-aad0-4395-b509-dfa15546cd44',
        logging: {
          silent: false,
          dir: './.tmp/logs',
          categories: {
            app: ['Logentries', 'Unknown']
          }
        }
      }
    }).get('app');
    should.exist(logger);
    done();
  });

});
