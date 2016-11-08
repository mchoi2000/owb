//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

var proxyquire = require('proxyquire').noCallThru();

describe('Invite Controller Test - ', function mainTestInvite() {
  it('should pass invite user process ', function showPass(done) {
    let inviteServiceMock = {
      sendOperatorInviteEmails: function sendOperatorInviteEmails() {
        return Promise.resolve(['successUser',['errorUser', {message:'errorMessage'}]]);
      }
    };
    let inviteController = proxyquire('./invite.controller', {
      './invite.service': inviteServiceMock
    });
    let res = {
      status: function statusFunc(code) {
        expect(code).toEqual(200);
        return this;
      },
      send: function sendFunc(response) {
        expect(response).toBeDefined();
        done();
      }
    };
    let req = {body: {'users':[{
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
          'lname': 'userLastName'
        }}
    };
    inviteController.inviteUser(req, res);
  });

  it('should fail invite user process ', function showFail(done) {
    let inviteServiceMock = {
      sendOperatorInviteEmails: function sendOperatorInviteEmails() {
        return Promise.reject({reason: 'Error'});
      }
    };
    let inviteController = proxyquire('./invite.controller', {
      './invite.service': inviteServiceMock
    });
    let res = {
      status: function codeFunc(code) {
        expect(code).toEqual(500);
        return this;
      },
      send: function sendFunc(error) {
        expect(error).toBeDefined();
        done();
      }
    };
    let req = {body: {users: [], invitedBy: {}}};
    inviteController.inviteUser(req, res);
  });

  it('should fail user invite process on validation', function showFailValidation(done) {
    let inviteServiceMock = {
      sendOperatorInviteEmails: function sendOperatorInviteEmails() {
        return Promise.reject({details:{message: 'Error'}});
      }
    };
    let inviteController = proxyquire('./invite.controller', {
      './invite.service': inviteServiceMock
    });
    let res = {
      status: function codeFunc(code) {
        expect(code).toEqual(400);
        return this;
      },
      send: function sendFunc(error) {
        expect(error).toBeDefined();
        done();
      }
    };
    let req = {body: {'users':[{
          'id': 'InvitedUserId',
          'emailAddress': 'InvitedUserEmail@ibm.com',
          'fname': 'fname',
          'lname': 'lname',
          'countries': ['country1', 'country2']
        }],
      'invitedBy': {
        'id': 'userId',
        'emailAddress': 'userEmail@google.com',
        'fname': 'userFirstName',
        'lname': 'userLastName'
      }}
    };
    inviteController.inviteUser(req, res);
  });
});
