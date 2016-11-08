//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

var _ = require('lodash');
var da = require('./audit.user.da.db');
var logger = require('../../components/logger').get('db');

module.exports = {
  addUserAudit: addUserAudit,
  getUserAuditsWithEmail: getUserAuditsWithEmail,
  getUserAuditsWithId: getUserAuditsWithId,
  showAllUserAudits: showAllUserAudits
};

// User methods
function addUserAudit(user) {
  return da.createUserAudit(user);
}

function getUserAuditsWithEmail(email) {
  var query = {
    selector: {
      userEmail: email
    }
  }
  return da.queryUserAudits(query).then(function resolveFind(result) {
    if (result.docs.length !== 0) {
      return result;
    } else {
      logger.warn('User %s not found in user audit database', email);
      throw {
        err: {
          status: 404,
          name: 'not_found',
          message: 'missing',
          error: true,
          reason: 'missing'
        },
        identifier: email
      };
    }
  });
}

function getUserAuditsWithId(userId) {
  var query = {
    selector: {
      userId: userId
    }
  }
  return da.queryUserAudits(query).then(function resolveFind(result) {
    if (result.docs.length !== 0) {
      return result;
    } else {
      logger.warn('User %s not found in user audit database', userId);
      throw {
        err: {
          status: 404,
          name: 'not_found',
          message: 'missing',
          error: true,
          reason: 'missing'
        },
        identifier: userId
      };
    }
  });
}

function showAllUserAudits() {
  return da.getAllUsersAudits().then(function allDocsCallback(results) {
    return _.map(results.rows, 'doc');
  });
}
