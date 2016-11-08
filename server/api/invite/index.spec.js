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

var ctrlMock = {
  inviteUser: 'inviteUser'
};

var expressMock = {
  Router: function() {
    return {
      post: function(path, ctrl) {
        if (path === '/invite') {
          ctrl.should.equal(ctrlMock.inviteUser);
        }
      }
    };
  }
};

describe('invite users index', function() {
  it('should create routes', function() {
    proxyquire('./index', {
      express: expressMock,
      './invite.controller': ctrlMock
    });
  });
});
