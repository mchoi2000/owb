//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

const inviteService = require('./invite.service')
const logger = require('../../components/logger').get('db');

module.exports.inviteUser = inviteUser;
function inviteUser(req, res) {
  let invitedUsers =  req.body;
  let actualResponse = {
    invitedUsers: [],
    inviteFailures: []
  };
  if (invitedUsers && invitedUsers.users.length > 0 && invitedUsers.invitedBy !== null) {
    inviteService.sendOperatorInviteEmails(invitedUsers)
      .then(function updateSuccess(response) {
        response.forEach(function(result) {
          if (result instanceof Array) {
            var failure = {
              User: result[0],
              Reason: result[1].message
            }
            actualResponse.inviteFailures.push(failure);
          }
          else {
            actualResponse.invitedUsers.push(result);
            logger.info(`Success: Sent invites to user `, result);
          }
        })
        res.status(200).send(actualResponse);
      })
      .catch(function updateFailure(err) {
        var failure = {
          User: invitedUsers.invitedBy.emailAddress,
          Reason: err.details.message
        }
        actualResponse.inviteFailures.push(failure);
        res.status(400).send(actualResponse);
      });
  }
  else {
    res.status(500).send({reason: 'Invalid Request'});
  }
}
