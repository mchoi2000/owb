'use strict';

/* jshint unused: false */
var proxyquire = require('proxyquire').noCallThru();
var sinon = require('sinon');
var should = require('should');

var serviceDBMock = {
  getService : function(id) {
    if (id === 'testService') {
      return Promise.resolve();
    }else {
      return Promise.reject();
    }
  }
};

var configMock = {
  tokenSecret: '1234'
};

var mockJWTStrat = {
  Strategy: function(opts, verifyFunc) {
    var self = this;

    self.verifyFunc = verifyFunc;
  },

  ExtractJwt: {
    fromAuthHeader: function() {
      return function(req) {};
    }
  }
};

var mockPassport = {

  initialize: sinon.stub().returns('initialize'),

  session: sinon.stub().returns('session'),

  use: function(strategy) {

    strategy.verifyFunc({user: {}}, {sub: 'testService', roles: 'testRoles'},
      function doneFunc(err, user) {
      //Test verify user object
      user.role.should.equal('testRoles');
    });
  },

  authenticate: function(strategy, opt, callback) {
    strategy.should.equal('jwt');

    if (callback) {
      callback();
    }

    var ret = function() {};
    return ret;
  }
};

var mockPassportBadRequest = {

  initialize: sinon.stub().returns('initialize'),

  session: sinon.stub().returns('session'),

  use: function(strategy) {

    strategy.verifyFunc({user: {}}, {sub: 'badService', roles: 'testRoles'},
      function doneFunc(err, user) {
      //Test verify user object
      user.toBeNull();
    });
  },

  authenticate: function(strategy, opt, callback) {
    strategy.should.equal('jwt');

    //strategy._verify();
    if (callback) {
      callback();
    }

    var ret = function() {};
    return ret;
  }
};

var jwtMock = {

  sign: function sign(payload, secret) {
    expect(payload.sub).toBe(1234);
    expect(secret).toBe('1234');
    return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9' +
      '.eyJyb2xlcyI6InRlc3QiLCJzdWIiOjEyMzQsImRlc2' +
      'NyaXB0aW9uIjoidGVzdCIsImlhdCI6MTQxNzY3MjgwMH0.lfPEmsLsfdilUy0Z600nOHBSgmXWSV77X9GWZNSba7M';
  }

};

var mockApp = {
  use: function(middleware) {
    expect(middleware).toBeDefined();
    expect(typeof middleware).toEqual('string');
  }
};

var jsonWebTokenService = proxyquire('./jsonWebTokenService',
  {
    '../../api/services/serviceDB.service': serviceDBMock,
    '../environment': configMock,
    passport: mockPassport,
    'passport-jwt': mockJWTStrat,
    jsonwebtoken: jwtMock
  });

describe('JSON Web Token Test Specifications - ', function() {

  it('should create a JSON web token', function() {
    var service = {
      roles: 'test',
      _id: 1234,
      description: 'test'
    };
    var result = jsonWebTokenService.constructJWT(service);
    expect(result).toEqual('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9' +
      '.eyJyb2xlcyI6InRlc3QiLCJzdWIiOjEyMzQsImRlc2' +
      'NyaXB0aW9uIjoidGVzdCIsImlhdCI6MTQxNzY3MjgwMH0.lfPEmsLsfdilUy0Z600nOHBSgmXWSV77X9GWZNSba7M');
  });

  it('should authenticate with a JWT token', function() {
    jsonWebTokenService.middleware(mockApp, mockPassport);
  });

  it('should not authenticate with a JWT token', function() {
    jsonWebTokenService.middleware(mockApp, mockPassportBadRequest);
  });

});
