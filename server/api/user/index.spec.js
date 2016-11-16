//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

var proxyquire = require('proxyquire').noCallThru();
var should = require('should');

var ctrlMock = {
  index: 'index',
  showAll: 'showAll',
  show: 'show',
  addInvitedUser: 'addInvitedUser',
  removeUsers: 'removeUsers',
  updateFeatures: 'updateFeatures',
  joinLocale: 'joinLocale'
};

var expressMock = {
  Router: function() {
    return {
      get: function(path, auth, func) {
        if (func === undefined) {
          func = auth;
        }
        if (path === '/') {
          func.should.equal(ctrlMock.index);
        } else if (path === '/all') {
          auth.should.equal('admin');
          func.should.equal(ctrlMock.showAll);
        } else if (path === '/:id') {
          auth.should.equal('access user info');
          func.should.equal(ctrlMock.show);
        } else {
          should.fail();
        }
      },

      post: function(path, auth, func) {
        if (path === '/updateFeatures/:id') {
          auth.should.equal('admin');
          func.should.equal(ctrlMock.updateFeatures);
        } else if (path === '/invite') {
          auth.should.equal('access user info');
          func.should.equal(ctrlMock.addInvitedUser);
        } else if (path === '/removeUsers') {
          auth.should.equal('access user info');
          func.should.equal(ctrlMock.removeUsers);
        } else if (path === '/joinLocale') {
          auth.should.equal('access user info');
          func.should.equal(ctrlMock.joinLocale);
        } else {
          should.fail();
        }
      }
    };
  }
};

var mockRoles = {
  can: function(value) {
    return value;
  },

  is: function(value) {
    return value;
  }
};

describe('user service index', function() {
  it('should create routes', function() {
    proxyquire('./index', {
      express: expressMock,
      './user.controller': ctrlMock,
      '../../middleware/auth/roles': mockRoles
    });
  });
});
