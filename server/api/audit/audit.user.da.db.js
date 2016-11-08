//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
var _ = require('lodash');
var config = require('../../config/environment');
var PouchDB = require('pouchdb');
var mkdirp = require('mkdirp');
var logger = require('../../components/logger').get('db');
var Errors = require('../../components/utils').Errors;
PouchDB.plugin(require('pouchdb-find'));

mkdirp.sync(config.dbdir);
var baseUrl = config.dbUrl + '/';

// create remote dbservices
var audits = new PouchDB(baseUrl + config.userAuditDB, config.remoteDBOptions);

audits.createIndex({
  index: {
    fields: ['userEmail'],
    name: 'userEmail'
  }
});

audits.createIndex({
  index: {
    fields: ['userId', 'userEmail', 'event.type'],
    name: 'eventType'
  }
});

// Exports
module.exports = {
  createUserAudit: createUserAudit,
  getUserAudit: getUserAudit,
  queryUserAudits: queryUserAudits,
  getAllUsersAudits: getAllUsersAudits
};

// User db methods
function createUserAudit(audit) {
  return audits.post(audit).
  then(function resolveCreateUserAudit(response) {
    logger.debug('Created user audit ' + response.userEmail + ' with id of ' + response.id);
    return response;
  }).catch(function rejectCreateUserAudit(reason) {
    logger.error('Unable to create user audit\n%j', reason);
    throw new Errors.OWBError('Error creating user:\n' + reason.message);
  });
}

function getUserAudit(identifier) {
  return audits.get(identifier)
    .then(function userGetSuccessCallback(doc) {
      return doc;
    })
    .catch(function userGetFailureCallback(err) {
        if (err.status === 404) {
          logger.warn('Audit %s not found in database', identifier);
          throw new Errors.MissingError(identifier, 'Audit not found with id ' + identifier);
        }

        logger.error('Audit %s not found in database', identifier);
        throw new Errors.OWBError('Error getting audit:\n' + err.message);
      }
    );
}

function getAllUsersAudits() {
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  return audits.allDocs({end_key: '_design', inclusive_end: false, include_docs: true}).
  then(function resolveGetAllUser(response) {
    logger.debug('Got all users audits from DB');
    return response;
  });
}

function queryUserAudits(query) {
  return audits.find(query).
  then(function resolveUserAudits(docs) {
    logger.debug('Got the user audits with query %s from DB ', query);
    return docs;
  }).
  catch(function rejectUserAudits(reason) {
    logger.warn('Unable to retrieve user audits based on ', query, reason);
    throw new Errors.OWBError(
   'Unable to get user audits with query ' + query + '\n' + reason.message);
  });
}
