//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

/* jshint unused: false */
var proxyquire = require('proxyquire').noCallThru();
var should = require('should');

var showAllShouldPass = true;

var mockProductsService = {};
var mockUserService = {
  getUser : function (id) {
    if (id === 'testUser@us.ibm.com') {
      return Promise.resolve('returned user info');
    } else {
      return Promise.reject('user not found');
    }
  },

  showAll: function () {
    if (showAllShouldPass) {
      return Promise.resolve('show all users');
    } else {
      return Promise.reject('dont show all users');
    }
  },

  removeUsers: function (editors, productId) {
    var promises = [];
    editors.forEach(function(data) {
      if (data === 'user@us.ibm.com' && productId === 'test') {
        promises.push(Promise.resolve('removed user'));
      } else {
        promises.push(Promise.reject('did not removed user'));
      }
    });
    return Promise.all(promises);
  },

  joinLocale: function(user, locales) {
    return Promise.resolve(locales);
  },
  updateUser: function(user) {
    if (user._id === 'userId') {
      return Promise.resolve('updated user info');
    } else {
      return Promise.reject('user not found');
    }
  }
};

var users = proxyquire('./user.controller', {
  './user.service': mockUserService
});

describe('user service', function() {
  beforeEach(function () {
    showAllShouldPass = true;
  });

  it('should check index without user', function() {
    var req = {};
    var res = {
      status: function(status) {
        status.should.equal(200);
      },
      json: function() {}
    };
    users.index(req, res);
  });

  it('should check index', function() {
    var req = {
      user: 'test'
    };
    var res = {
      status: function(status) {
        status.should.equal(200);
      },
      json: function() {}
    };
    users.index(req, res);
  });

  it('should show user', function() {
    var req = {
      params: {
        id: decodeURIComponent('testUser@us.ibm.com')
      }
    };
    var res = {
      status: function(status) {
        status.should.equal(200);
      }
    };
    users.show(req, res);
  });

  it('should fail to show user', function() {
    var req = {
      params: {
        id: decodeURIComponent('nonUser@us.ibm.com')
      }
    };
    var res = {
      status: function(status) {
        status.should.equal(404);
      }
    };
    users.show(req, res);
  });

  it('should fail to show user', function() {
    var req = {
      params: {}
    };
    let res = {
      status: function(status) {
        status.should.equal(400);
        return {
          status: 400,
          json: function() {}
        };
      }
    };
    users.show(req, res);
  });

  it('should show all users', function() {
    showAllShouldPass = true;
    var req = {};
    var res = {
      status: function(status) {
        status.should.equal(200);
      }
    };
    users.showAll(req, res);
  });

  it('should not show all users', function() {
    showAllShouldPass = false;
    var req = {};
    var res = {
      status: function(status) {
        status.should.equal(500);
      }
    };
    users.showAll(req, res);
  });

  it('should remove user', function() {
    var req = {
      body: {
        editorIds: ['user@us.ibm.com'],
        productId: 'test'
      }
    };
    var res = {
      send: function(status) {
        status.should.equal(200);
      }
    };
    users.removeUsers(req, res);
  });

  it('should not remove user', function() {
    var req = {
      body: {
        editorIds: [],
        productId: 'test'
      }
    };
    var res = {
      send: function(status) {
        status.should.equal(200);
      }
    };
    users.removeUsers(req, res);
  });

  it('should join locale', function() {
    var req = {
      body: {
        locales: [{locale: 'en-us', roles: ['editor']}]
      }
    };
    var res = {
      status: function(status) {
        status.should.equal(200);
      }
    };
    users.joinLocale(req, res);
  });

  it('should update user', function() {
    var req = {
      body: {
        _id: 'userId'
      }
    };
    var res = {
      status: function(status) {
        status.should.equal(200);
      }
    };
    users.updateUser(req, res);
  });
});
