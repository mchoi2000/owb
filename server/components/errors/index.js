//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
/**
 * Error responses
 */

'use strict';

var logger = require('../logger').get('app');
var path = require('path');
var config = require('../../config/environment');

var statusCode = 404;
var result = {
  status: statusCode
}

exports.invalidRequest = invalidRequest;
function invalidRequest(req, res) {
  logger.warn('404 Error Rendered for request %s', req.path);
  res.status(result.status);
  res.end();
}

exports.pageNotFound  = pageNotFound;
function pageNotFound(req, res) {
  logger.warn('404 Error Rendered for request %s', req.path);
  res.status(result.status);
  res.sendFile(path.join(config.root, 'server/components/errors/templates/404.html'));
}
