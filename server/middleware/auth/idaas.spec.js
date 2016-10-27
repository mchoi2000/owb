//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
//SSO Unit Testing

'use strict';
var proxyquire = require('proxyquire').noCallThru();
var should = require('should');
var sinon = require('sinon');
var config = require('../../config/environment');

var uniqueSecurityName = 'NewUniqueSecurityNameID';

var testUser = {
  id: 'https://connect.ibmserviceengage.com/blueid/test@test.com',
  _id: 'https://connect.ibmserviceengage.com/blueid/test@test.com',
  email: 'test@test.com',
  roles: ['testRole'],
  fname: 'first',
  lname: 'last',
  registered: false,
  verified: false,
  products: [],
  features: []
};

var newUser = {
  id: 'https://connect.ibmserviceengage.com/blueid/newUser@test.com',
  email: 'newUser@test.com',
  roles: []
};

var mockApp = {
  use: function(middleware) {
    if (middleware === '/admin/') {
      testEnsureAuth(arguments[1]);
    } else if (middleware === '/provider/') {
      testEnsurePwbAccess(arguments[2]);
      testEnsureRegister(arguments[3]);
    }
  },

  get: function(path, fn1, fn2) {
    if (path === '/auth/sso') {
    } else if (path === '/auth/sso/oidc/return') {
      testOpenReturn(fn1);
    } else if (path === '/auth/logout') {
      testLogout(fn2);
    } else if (path === '/auth/fail') {
      var res = {
        status: function(stat) {
          stat.should.equal(403);
          return {
            end: function() {}
          };
        }
      };

      fn1(null, res);
    }
  },

  post: function(path, fn1, fn2) {
    path.should.equal('/auth/register');
    testRegister(fn2);
  }
};

var mockPassport = {
  deserializeUser: function(deserializeFunction) {
    deserializeFunction(testUser._id, function(err, user) {
      should.not.exist(err);
      user.should.equal(testUser);
    });

    deserializeFunction(newUser._id, function(err, user) {
      should.not.exist(err);
      user.should.equal(false);
    });
  },

  initialize: sinon.stub().returns('initialize'),
  session: sinon.stub().returns('session'),

  use: function() {},

  authenticate: function(strategy, callback) {
    strategy.should.equal('openidconnect');

    if (callback) {
      callback('testError');
      callback();
      callback(null, testUser);
    }

    var ret = function() {};
    return ret;
  }
};

var mockUsers = {
  getUser: function(id) {
    if (id === testUser._id) {
      return Promise.resolve(testUser);
    } else {
      return Promise.reject('not found');
    }
  },

  addUser: function(userData) {
    userData.id.should.equal(newUser.id);
    userData.email.should.equal(newUser.email);
    return Promise.resolve();
  },

  updateUser: function(user) {
    if (user._id === testUser._id) {
      user._id.should.equal(testUser._id);
      if (!user.notAnIbmer) {
        user.fname.should.equal('testFirst');
        user.lname.should.equal('testLast');
        user.registered.should.be.true();
        return Promise.resolve();
      }
    } else {
      return Promise.reject('update error');
    }
  }
};

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
// jscs:disable maximumLineLength
var mockOpenIDConnect = {
  IDaaSOIDCStrategy: function(options, verify) {
    options.authorizationURL.should.equal(config.idaas.authURL);
    options.tokenURL.should.equal(config.idaas.tokenURL);
    console.log('config.idaas.clientID is:::', config.idaas.clientID);
    options.clientID.should.equal(config.idaas.clientID);
    options.clientSecret.should.equal(config.idaas.clientSecret);
    options.callbackURL.should.equal(config.idaas.callbackURL);
    options.skipUserProfile.should.equal(true);
    options.issuer.should.equal(config.idaas.issuer);

    verify('testIssuer', testUser._id, {
      _json: {
        uid: uniqueSecurityName,
        emailAddress: testUser.email,
        firstName: testUser.fname,
        lastName: testUser.lname
      }
    }, 'testAuth', 'testRefresh', {}, function(err, user) {
      user.id.should.equal(uniqueSecurityName);
      user.email.should.equal(testUser.email);
      user.fname.should.equal(testUser.fname);
      user.lname.should.equal(testUser.lname);
      should.not.exist(err);
    });
  }
};

function testEnsureAuth(fn) {
  var req = {
    isAuthenticated: function() {
      return false;
    },
    user: {
      registered: false,
      products: []
    },
    originalUrl: 'testUrl',
    session: {
      save: function(cb) {cb();}
    }
  };

  var res = {
    redirect: function(path) {
      path.should.equal(config.webRoot + 'auth/sso');
    }
  };
  var next = sinon.spy();

  fn(req, res, next);
  next.callCount.should.equal(0);
  req.session.returnTo.should.equal('testUrl');

  req.isAuthenticated = function() {return true;};
  fn(req, res, next);
  next.callCount.should.equal(1);
}

function testEnsurePwbAccess(fn) {
  var req = {
    user: {
      registered: false,
      products: [],
      roles: []
    },
    originalUrl: 'testUrl',
    session: {}
  };
  var res = {
    redirect: function(path) {
      path.should.equal(config.webRoot + 'sorryPage');
    }
  };
  var next = sinon.spy();

  fn(req, res, next);

  req.user.products = ['test'];
  fn(req, res, next);

  req.user.PWBPlatform = true;
  fn(req, res, next);
}

function testEnsureRegister(fn) {
  var req = {
    user: {
      roles: ['provider'],
      registered: false,
      products: []
    },
    originalUrl: 'testUrl',
    session: {
      save: function(cb) {cb();}
    }
  };
  var res = {
    redirect: function(path) {
      path.should.equal(config.webRoot + 'register');
    }
  };
  var next = sinon.spy();

  fn(req, res, next);
  next.callCount.should.equal(0);
  req.session.returnTo.should.equal('testUrl');

  req.user.registered = true;
  fn(req, res, next);
  next.callCount.should.equal(1);
}

function testOpenReturn(fn) {
  var req = {
    login: function(user, callback) {
      callback('testError');
      callback();
    },
    session: {
      returnTo: 'testUrl',
      save: function(cb) {cb();}
    }
  };

  var res = {
    redirect: function() {}
  };
  var next = sinon.spy();

  fn(req, res, next);
}

function testRegister(fn) {
  var req = {
    user: testUser,
    body: {
      fname: 'testFirst',
      lname: 'testLast'
    }
  };
  var res = {
    sendStatus: function(status) {
      status.should.equal(200);
    }
  };

  fn(req, res);

  req.user = {
    _id: 'rando@test.com',
    registered: false
  };
  fn(req, res);

  req.user.registered = true;
  res.sendStatus = function(status) {
    status.should.equal(404);
  };
  fn(req, res);
}

function testLogout(fn) {
  var req = {
    session: {
      destroy: function(callback) {
        callback();
      }
    },
    logOut: function() {},
    user: testUser
  };
  var res = {
    clearCookie: function(name, obj) {
      name.should.equal('JSESSIONID');
      obj.path.should.equal('/');
    },
    redirect: function(path) {
      path.should.equal('https://www.ibm.com/account/us-en/signout.html?lnk=mmi');
    }
  };

  fn(req, res);
}

var mockRoles = {
  can: function can() {},
  is: function is() {}
};

var sso = proxyquire('./idaas', {
  passport: mockPassport,
  './passport-idaas-openidconnect/lib': mockOpenIDConnect,
  '../../api/user/user.service': mockUsers,
  './roles': mockRoles
});

describe('oidc', function() {
  it('should load middleware', function(done) {
    mockPassport.serializeUser = function(serializeFunction) {
      serializeFunction({id: testUser.id, email: testUser.email}, function(err, id) {
        should.not.exist(err);
        id.should.equal(testUser._id);
      });

      serializeFunction({id: newUser.id, email: newUser.email}, function(err, id) {
        should.not.exist(err);
        id.should.equal(newUser.id);
        done();
      });
    };

    sso.middleware(mockApp, mockPassport);

  });

  it('should configure routes', function() {
    sso.routes(mockApp, mockPassport);
  });
});

