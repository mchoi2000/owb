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
  getAllCMMs: getAllCMMs,
  joinLocale: joinLocale
};

// User methods
function addUser(user) {
  var newUser = {
    _id: user.id,
    email: user.email,
    fname: user.fname,
    lname: user.lname,
    registered: false,
    countries: [],
    roles: []
  };
  return da.createUser(user);
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

function joinLocale(user, locales) {
  user.locales = locales;
  return da.updateUser(user);
}

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
