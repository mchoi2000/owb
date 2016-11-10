//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

var _ = require('lodash');
var da = require('./user.da.db');
var logger = require('../../components/logger').get('db');

module.exports = {
  addUser: addUser,
  getUser: getUser,
  showAll: showAll,
  updateUser: updateUser,
  getCMMByCountry: getCMMByCountry,
  getAllCMMs: getAllCMMs
};

// User methods
function addUser(user) {
  var newUser = {
    _id: user.id,
    email: user.email,
    fname: user.fname,
    lname: user.lname,
    registered: false,
    locales: [],
    roles: []
  };
  return da.createUser(newUser);
}

function getUser(identifier) {
  return da.getUser(identifier);
}

function showAll() {
  return da.getAllUsers()
    .then(function allDocsCallback(results) {
      return _.map(results.rows, 'doc');
    });
}

function updateUser(newData) {
  return da.getUser(newData._id)
    .then(function usersGet(doc) {
      return da.updateUser(_.mergeWith(doc, newData, function userPutCallback(a, b) {
        if (_.isArray(a)) {
          var test =  a.concat(b);
          return test;
        }
      }));
    }
  );
}
/*
// Remove users from collab modal
function removeUsers(userIds, productId) {
  var removedEditors = [];
  var removedInvitees = [];
  return productDa.get(productId)
    .then(function removeUsersFromProduct(doc) {
      // Remove the users from the product
      var newEditorsList = [];
      var newInvitedUsers = [];
      // Remove editors from product
      doc.offeringData.editors.forEach(function(editor) {
        if (!_.includes(userIds, editor)) {
          newEditorsList.push(editor);
        } else {
          removedEditors.push(editor);
        }
      });
      // Remove invitees from product
      doc.offeringData.invitedUsers.forEach(function(invitee) {
        if (!_.includes(userIds, invitee.email)) {
          newInvitedUsers.push(invitee);
        } else {
          removedInvitees.push(invitee);
        }
      });
      doc.offeringData.editors = newEditorsList;
      doc.offeringData.invitedUsers = newInvitedUsers;
      return updateUsers(doc);
    })
    .then(function removeProductFromUsers(response) {
      // Remove the product from the users
      removedEditors = removedEditors.map(function(provider) {
        return da.getUser(provider)
          .then(function userFoundInUserdb(doc) {
            // User found in user db
            var indexOfValue = doc.products.indexOf(productId);
            doc.products = _.difference(doc.products, [productId]);
            // Remove product from user
            return da.updateUser(doc);
          })
          .catch(function userNotFoundInUserdb(err) {
            logger.warn('Editor %s to remove from product %s not found in user db',
                        productId, provider);
          });
      });
      return Promise.all(removedEditors);
    })
    .then(function removeProductFromUsers(response) {
      // Remove the product form the invitees
      removedInvitees = removedInvitees.map(function(provider) {
        return invitedDa.getInvitedUser(provider.email)
          .then(function userFoundInInvitedb(doc) {
            // User found in invite db
            if (doc.products.length === 1 && doc.products[0] === productId) {
              // Remove invited user from the db because they don't have any other products
              return invitedDa.removeInvitedUser(doc);
            } else {
              // Remove product from invited user's product array
              doc.products = _.difference(doc.products, [productId]);
              return invitedDa.updateInvitedUser(doc);
            }
          })
          .catch(function userNotFoundInInvitedb(notFoundErr) {
            logger.warn('Invited user %s to remove from product %s not found in db',
                        productId, provider);
          })
      });
      return Promise.all(removedInvitees);
    })
    .catch(function(err) {
      throw err
    });
}
*/

function getCMMByCountry(countries) {
  let query = {
    selector: {
      email: {
        $gt: null
      },
      countries: {
        $elemMatch: {$in: countries}
      },
      roles: {
        $elemMatch: {$eq: 'cmmReviewer'}
      }
    },
    fields: ['_id', 'countries', 'email', 'fname', 'lname']
  };

  return da.queryUsers(query)
    .then(function test(docs) {
      return docs.docs;
    });
}

function getAllCMMs() {
  let query = {
    selector: {
      email: {
        $gt: null
      },
      countries: {
        $exists: true
      },
      roles: {
        $elemMatch: {$eq: 'cmmReviewer'}
      }
    },
    fields: ['_id', 'countries', 'email', 'fname', 'lname']
  };

  return da.queryUsers(query)
    .then(function test(docs) {
      return docs.docs;
    });
}
