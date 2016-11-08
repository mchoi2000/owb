//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
var _ = require('lodash');
var logger = require('../../components/logger').get('db');
var service = require('./user.service');

module.exports = {
  index: index,
  show: show,
  showAll: showAll,
  removeUsers: removeUsers
};

function index(req, res) {
  var user = req.user;
  if (!user) {
    user = {
      roles: ['unauthenticated'],
      registered: false
    };
  }

  res.status(200);
  res.json(user);
}

function show(req, res) {
  if (req.params.id === undefined) {
    logger.warn('User ctrl show missing req.params.id');
    return res.status(400).json({
      reason: 'Required status parameter missing in request query'
    });
  }
  var id = decodeURIComponent(req.params.id);
  service.getUser(id)
    .then(function getUserCallback(response) {
      return res.status(200).json(response);
    })
    .catch(function getUserFail(reason) {
      logger.warn('User with id %s not found', reason.documentId);
      return res.status(404).json({reason: 'Not Found'});
    });
}

function showAll(req, res) {
  service.showAll()
    .then(function allDocsSuccess(results) {
      return res.status(200).json(results);
    })
    .catch(function allDocsFail(reason) {
      logger.warn('All users not found ', reason);
      return res.status(500).json(reason);
    });
}

function removeUsers(req, res) {
  service.removeUsers(req.body.editorIds, req.body.productId)
    .then(function removeUsersSuccess(response) {
      return res.status(200).json(response);
    }).catch(function removeUsersFailure(error) {
      return res.status(500).json(error);
    });
}
