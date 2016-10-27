//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

var utils = require('./index');
const should = require('should');

describe('server utils', function() {
  it('should denodeify function', function(done) {
    function nodeStyle(arg, callback) {
      arg.should.equal('arg1');
      callback(null, 'result');
    }

    utils.denodeify(nodeStyle)('arg1')
      .then(function(result) {
        result.should.equal('result');
        done();
      });
  });

  it('should denodeify function w/ args', function(done) {
    function nodeStyle(arg, callback) {
      arg.should.equal('arg1');
      callback(null, 'result');
    }

    utils.denodeify(nodeStyle, 1)('arg1', 'arg2')
      .then(function(result) {
        result.should.equal('result');
        done();
      });
  });

  it('should denodeify function w/ return', function(done) {
    function nodeStyle(arg) {
      arg.should.equal('arg1');
      return Promise.resolve('result');
    }

    utils.denodeify(nodeStyle)('arg1')
      .then(function(result) {
        result.should.equal('result');
        done();
      });
  });

  it('should denodeify function w/ promise func', function(done) {
    function nodeStyle(arg) {
      arg.should.equal('arg1');
      var ret = function() {};
      ret.then = function(resolve) {
        resolve('result');
      };
      return ret;
    }

    utils.denodeify(nodeStyle)('arg1')
      .then(function(result) {
        result.should.equal('result');
        done();
      });
  });

  it('should throw error for denodeify function', function(done) {
    function nodeStyle(arg, callback) {
      arg.should.equal('arg1');
      callback(new Error());
    }

    utils.denodeify(nodeStyle)('arg1')
      .catch(function(err) {
        console.log('err is:::', err);
        should.exist(err);
        done();
      });
  });
});
