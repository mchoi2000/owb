//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

const emailService = require('../../components/email');
const userService = require('../user/user.service');
const auditService = require('../audit/audit.user.service');
const logger = require('../../components/logger').get('db');
const ValidationError = require('../../components/utils').Errors.ValidationError;
const OWBError = require('../../components/utils').Errors.OWBError;
const emailPattern = /@(?:[a-zA-Z]{2}\.)?ibm\.com$/;

module.exports = {
  sendOperatorInviteEmails: sendOperatorInviteEmails
};

function sendOperatorInviteEmails(invitedUsers) {
  return userService.getUser(invitedUsers.invitedBy.id).then(function checkResult(invitedUser) {
    if (!emailPattern.test(invitedUsers.invitedBy.emailAddress)) {
      let err = new ValidationError('Invalid email address of the invitedBy user');
      logger.warn('Invalid email address of the invitedBy user', invitedUsers.invitedBy.email);
      return Promise.reject(err);
    }
    else {
      let userList = invitedUsers.users.map(function (user) {
        if (!emailPattern.test(user.emailAddress)) {
          let error = new ValidationError('Invalid email address for user');
          logger.warn(`Error while inviting user  ${error}`, 'for user ', user.emailAddress);
          return Promise.all([user.emailAddress, error]);
        }
        return userService.addUser(createOperator(user))
       .then (function auditCreate(doc) {
          logger.info(`Sending email to user `, user.emailAddress);
          emailService.invite.emailInvitedOperator(user.countries, invitedUsers.invitedBy, user);
          let audit = createUserAudit(invitedUsers.invitedBy, user);
          auditService.addUserAudit(audit);
          return user.emailAddress;
        })
       .catch(function failureToAddUserAudit(failureErr) {
          logger.warn(`Error while inviting user  ${failureErr}`);
          let error = new ValidationError(`Error while inviting user ${failureErr}`);
          return Promise.all([user.emailAddress, error]);
        });
      });
      return Promise.all(userList);
    }
  }).catch(function userNotFound(NotFoundErr) {
    let userErr = new ValidationError('User Not Found', NotFoundErr);
    logger.warn('Invalid user invite', NotFoundErr);
    return Promise.reject(userErr);
  })
}

function createOperator(user) {
  let operator = {
    _id : user.id,
    email : user.emailAddress,
    name : user.fname,
    lname : user.lname,
    registered : false
  };

  let userCountries = user.countries;
  operator.countries = [];
  userCountries.forEach(function(country) {
    let operatorCountry = {};
    operatorCountry.name = country;
    operatorCountry.roles = ['owner'];
    operator.countries.push(operatorCountry);
  });

  operator.roles = ['cmmReviewer', 'operator'];
  return operator;
}

function createUserAudit(inviter, user) {
  let audit = {
    userId: user.id,
    userEmail: user.emailAddress,
    event: {
      type: 'invite',
      invitedBy: {
        id : inviter.id,
        emailAddress: inviter.emailAddress,
        fname: inviter.fname,
        lname: inviter.lname
      },
      timestamp: ((new Date(2000, 1, 1)).getTime() / 1000)
    }
  }
  return audit;
}

