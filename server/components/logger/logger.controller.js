//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
var logger = require('./index.js').get('db');

exports.toLogString = toLogString;
function toLogString(userId, action, product, productId, status) {
  var logString = 'USER=' + userId + ' - action=' + action + ' - product='
  if (product === null) {
    product = 'N/A';
  }

  if (productId === null) {
    productId = 'N/A';
  }

  logString += product + ' - productId=' + productId + ' - status=' + status;

  logger.info(logString);

  return logString;
}
