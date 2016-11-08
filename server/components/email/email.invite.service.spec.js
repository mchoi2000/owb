//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

/* jshint unused: false */
var config = require('../../config/environment');
var denodeify = require('../../components/utils').denodeify;
var proxyquire = require('proxyquire').noCallThru();
var should = require('should');
var stat = denodeify(require('fs').stat);

var testUser = {
  _id: 'testOwner',
  fname: 'first',
  lname: 'last',
  emailAddress: 'user@email.com'
};

var testInviter = {
  fname: 'first',
  lname: 'last'
};

var testCountries = ['US', 'UK'];

const OWB_TEAM = config.emails.owbTeamEmail;
const OWB_EMAIL_NAME = config.emails.owbTeamName;
const NOREPLY_EMAIL = config.emails.noreplyEmail;

describe('user invite email service', function() {
  beforeEach(function() {
    jasmine.addMatchers({
      toFail: function() {
        return {
          compare: function(actual, expected) {
            return {
              pass: false,
              message: expected
            };
          }
        };
      }
    });
  });

  it('should send user email invite', function(done) {
    var mockEmailCtrl = {
      send: function(emailData) {
        emailData.contactName.should.equal(testUser.fname);
        emailData.subject.should.equal('You have been invited to collaborate on ' +
          'IBM Marketplace\'s Globalization Workbench');
        emailData.template.should.equal('inviteUserEmail.html');
        emailData.recipient.should.equal(testUser.emailAddress);
        emailData.from.should.equal(NOREPLY_EMAIL);
        emailData.fromname.should.equal(OWB_EMAIL_NAME);
        emailData.replyto.should.equal(OWB_TEAM);
        emailData.inviter.should.eql(testInviter.fname + ' ' + testInviter.lname);
        emailData.countries.should.eql(testCountries);
        emailData.config.should.eql(config);
        return stat(__dirname + '/templates/' + emailData.template)
          .then(function() {
            return {ok: true};
          });
      }
    };

    var email = proxyquire('./email.invite.service', {
      './email.controller': mockEmailCtrl
    });

    email.emailInvitedOperator(testCountries, testInviter, testUser)
      .then(function(result) {
        console.log('result is::::', result);
        result.ok.should.equal(true);
        done();
      }, function(reason) {
        expect().toFail(reason.toString());
        done();
      });
  });
});
