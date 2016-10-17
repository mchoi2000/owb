/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */

'use strict';

var _ = require('lodash');
var path = require('path');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

var environment = {
  env: process.env.NODE_ENV,
  root: path.normalize(__dirname + '/../../..'),
  webRoot: requiredProcessEnv('CFCI_WEB_ROOT'),
  // Application attributes in Bluemix
  cfApp: JSON.parse(requiredProcessEnv('VCAP_APPLICATION'))

};

// Merge specific NODE_ENV configuration settings into environment
environment = _.merge(environment, require('./' + process.env.NODE_ENV + '.js'));

module.exports = environment;
