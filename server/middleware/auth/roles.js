//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

const ConnectRoles = require('connect-roles');
const _ = require('lodash');

var roles = new ConnectRoles({
  failureHandler: function failureHandler(req, res, action) {
    res.status(403);
    res.json({message: 'Unauthorized', action: action});
  },
  async: true,
  matchRelativePaths: true
});

roles.use('authenticated', function authenticatedCallback(req) {
  return req.isAuthenticated();
});

roles.use('registered operator', function regOperatorRole(req) {
  if (_.includes(req.user.roles, 'operator')) {
    return req.user && _.includes(req.user.roles, 'operator') &&
    req.user.registered;
  }
});

roles.use('unregistered operator', function unregProviderRole(req) {
  if (_.includes(req.user.roles, 'operator')) {
    return req.user && _.includes(req.user.roles, 'operator') &&
    !req.user.registered;
  }
});

roles.use('reviewer', function reviewerRole(req) {
  return req.user &&
        _.includes(req.user.roles, 'cmmReviewer')
});

roles.use('cmmReviewer', function cmmReviewerCallback(req) {
  return _.includes(req.user.roles, 'cmmReviewer');
});

//User API Rules
roles.use('access user info', function accessUserInfoCallback(req) {
  return _.includes(req.user.roles, 'cmmReviewer');

});

//Participant Settings

//Only owner of the product has change pwner privileges.
/*roles.use('change owner', function changeOwnerCallback(req) {
  return (req.isAuthenticated() &&
  checkIfCountryOwner(req.body.currentOwnerId, req.body.productId));
});

//Editors can remove only themselves. Owners cannot remove themselves before transfering ownership.
roles.use('remove editor', function removedEditorCallback(req) {
  return (req.isAuthenticated() &&
  isEditor(req.body.editorId, req.body.productId) &&
  !checkIfCountryOwner(req.body.editorId, req.body.productId));
});

function checkIfCountryOwner(userInRequest, productId) {
  var isOwner = false;
  return productDa.get(productId).then(function dbserviceShowCallback(doc) {
    isOwner = (userInRequest === doc.offeringData.owner);
    return isOwner;
  },
  function dbserviceShowFailureCallback(err) {
    isOwner = false;
    return isOwner;
  });
}

function isEditor(userInRequest, productId) {
  var isInEditorList = false;
  return productDa.get(productId).then(function dbserviceShowCallback(doc) {
    if (doc.offeringData.editors.indexOf(userInRequest) > -1) {
      isInEditorList = true;
      return isInEditorList;
    } else {
      isInEditorList = false;
      return isInEditorList;
    }
  }, function dbserviceShowFailureCallback(err) {
    isInEditorList = false;
    return isInEditorList;
  });
} */

module.exports = roles;
