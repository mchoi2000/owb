//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

var proxyquire = require('proxyquire').noCallThru();
var utils = require('../../components/utils');
var assert = require('assert');

var user = {
  '_id': 'userId',
  'email': 'userEmail@ibm.com',
  'fname': 'userFirstName',
  'lname': 'userLastName',
  'registered': false,
  'countries': ['country1'],
  'roles': ['admin']
};
var userAudit = {

};
var invitedUsers = {
  'users':[{
    'id': 'InvitedUserId',
    'emailAddress': 'InvitedUserEmail@ibm.com',
    'fname': 'fname',
    'lname': 'lname',
    'countries': ['country1', 'country2']
  }],
  'invitedBy': {
    'id': 'userId',
    'emailAddress': 'userEmail@ibm.com',
    'fname': 'userFirstName',
    'lname': 'userLastName',
    'roles': ['admin']
  }
};

beforeEach(function() {
  var self = this;
  self.inviteService = proxyquire('./invite.service', {
    '../../components/email': {
      invite: {
        emailInvitedOperator: function(countries, invitedBy, user) {
        }
      }
    },
    '../user/user.service': {
      addUser: function (operator) {
        return Promise.resolve({ok: true});
      },
      getUser: function(id) {
        return Promise.resolve(user);
      }
    },
    '../audit/audit.user.service': {
      addUserAudit: function(audit) {
        return Promise.resolve(userAudit);
      }
    }
  });
});

describe('Invite Service Test - ', function mainTestInviteService() {
  var self = this;
  it('should pass invite user service process ', function showPass(done) {
    var self = this;
    var cb = function (results) {
      assert(results instanceof Array);
      done();
    };
    self.inviteService.sendOperatorInviteEmails(invitedUsers).then(cb);
  });

  it('should fail the user invite process because of invalid invited user ', function showFail(done)
  {
    var self = this;
    self.inviteService = proxyquire('./invite.service', {
      '.../../components/email': {
        invite: {
          emailInvitedOperator: function(countries, invitedBy, user) {
          }
        }
      },
      '../user/user.service': {
        addUser: function (operator) {
          return Promise.resolve({ok: true});
        },
        getUser: function(id) {
          return Promise.reject({err: {status: 404}});
        }
      },
      '../audit/audit.user.service': {
        addUserAudit: function(audit) {
          return Promise.resolve(userAudit);
        }
      }
    });
    invitedUsers.invitedBy.id = '';
    var cb = function (err) {
      assert(err.name === 'ValidationError');
      done();
    };
    self.inviteService.sendOperatorInviteEmails(invitedUsers).catch(cb);
  });

  it('should fail the user invite process because invitee user donot have an admin role',
  function showFail(done) {
    var self = this;
    user.roles = '[\'operator\']';
    var cb = function (err) {
      assert(err.name === 'ValidationError');
      done();
    };
    self.inviteService.sendOperatorInviteEmails(invitedUsers).catch(cb);
  });

  it('should fail the user invite process because of invalid email of the invited user ',
  function showFail(done) {
    var self = this;
    invitedUsers.invitedBy.id = 'userId';
    invitedUsers.invitedBy.emailAddress = 'userEmail@ibm.com';
    invitedUsers.users[0].emailAddress = 'someEmail@google.com';
    user.roles = '[\'admin\']';
    var cb = function (results) {
      assert(results instanceof Array);
      done();
    };
    self.inviteService.sendOperatorInviteEmails(invitedUsers).then(cb);
  });

  it('should fail the user invite process because of application error ',
    function showFail(done) {
      var self = this;
      self.inviteService = proxyquire('./invite.service', {
        '.../../components/email': {
          invite: {
            emailInvitedOperator: function(countries, invitedBy, user) {
            }
          }
        },
        '../user/user.service': {
          addUser: function (operator) {
            return Promise.reject({err: {status: 404}});
          },
          getUser: function(id) {
            return Promise.resolve(user);
          }
        },
        '../audit/audit.user.service': {
          addUserAudit: function(audit) {
            return Promise.resolve(userAudit);
          }
        }
      });
      invitedUsers.users[0].emailAddress = 'userEmail@ibm.com';
      var cb = function (results) {
        assert(results instanceof Array);
        done();
      };
      self.inviteService.sendOperatorInviteEmails(invitedUsers).then(cb);
    });

});
