//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

const emailController = require('./email.controller');
const config = require('../../config/environment');

const OWB_TEAM = config.emails.owbTeamEmail;
const OWB_EMAIL_NAME = config.emails.owbTeamName;
const NOREPLY_EMAIL = config.emails.noreplyEmail;

module.exports = {
  emailInvitedOperator: emailInvitedOperator
};

function emailInvitedOperator(countries, inviter, invitee) {
  const emailData = {
    contactName: invitee.fname,
    subject: 'You have been invited to collaborate on IBM Marketplace\'s Globalization Workbench',
    template: 'inviteUserEmail.html',
    recipient: invitee.emailAddress,
    from: NOREPLY_EMAIL,
    replyto: OWB_TEAM,
    fromname: OWB_EMAIL_NAME,
    inviter: inviter.fname + ' ' + inviter.lname,
    countries: countries,
    config: config
  };
  return emailController.send(emailData);
}
