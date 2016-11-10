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

//var syncOpts = {live: true, retry: true};
var baseUrl = config.dbUrl + '/';

// create remote dbservices
var users = new PouchDB(baseUrl + config.usersDB);

users.createIndex({
  index: {
    fields: ['email'],
    name: 'email'
  }
});

users.createIndex({
  index: {
    fields: ['countries', 'email', 'roles'],
    name: 'role'
  }
});

// Exports
module.exports = {
  createUser: createUser,
  getUser: getUser,
  getAllUsers: getAllUsers,
  updateUser: updateUser,
  findUser: findUser,
  queryUsers: queryUsers
};

// User db methods
function createUser(user) {
  return users.post(user)
  .then(function resolveCreateUser(response) {
    logger.debug('Created user ' + response.email + ' with id of ' + response.id);
    return response;
  })
  .catch(function rejectCreateUser(reason) {
    logger.error('Unable to create user\n%j', reason);
    throw new Errors.OWBError('Error creating user:\n' + reason.message);
  });
}

function getUser(identifier) {
  return users.get(identifier)
  .then(function userGetSuccessCallback(doc) {
    return doc;
  })
  .catch(function userGetFailureCallback(err) {
    if (err.status === 404) {
      logger.warn('User %s not found in database', identifier);
      throw new Errors.MissingError(identifier, 'User not found with id ' + identifier);
    }

    logger.error('User %s not found in database', identifier);
    throw new Errors.OWBError('Error getting user:\n' + err.message);
  }
  );
}

function findUser(email) {
  var query = {
    selector: {
      email: email
    }
  }
  return users.find(query)
  .then(function resolveFind(result) {
    if (result.docs.length !== 0) {
      return result;
    }
    else {
      logger.warn('User %s not found in database', email);
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

function getAllUsers() {
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  return users.allDocs({end_key: '_design', inclusive_end: false, include_docs: true})
  .then(function resolveGetAllUser(response) {
    logger.debug('Got all user from DB');
    return response;
  });
}

function updateUser(data) {
  return users.put(data)
  .then(function resolveUpdate(response) {
    logger.debug('Updated user %s to rev %s', response.id, response.rev);
    return response;
  })
  .catch(function rejectUpdate(reason) {
    if (reason.status === 409) {
      logger.warn('Conflict error updating user %s to rev %s', reason.id, reason.rev);
      throw new Errors.ConflictError(reason.id, reason.rev, 'Conflict Error\n' + reason.message);
    }

    logger.warn('Unable to update user %s from rev %s\n%j', reason.id, reason.rev, reason);
    throw new Errors.OWBError('Error updating user:\n' + reason.message);
  });
}

//Get user roles
function queryUsers(query) {
  return users.find(query)
  .then(function resolveCMMsByCountry(docs) {
    logger.debug('Got the users with query %s from DB ', query);
    return docs;
  })
  .catch(function rejectCMMsByCountry(reason) {
    logger.warn('Unable to retrieve users based on ', query, reason);
    throw new Errors.OWBError(
   'Unable to get users with query ' + query + '\n' + reason.message);
  });
}
