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
  cfApp: JSON.parse(requiredProcessEnv('VCAP_APPLICATION')),
  nodeEnv: requiredProcessEnv('NODE_ENV'),

  redis: {
    host: 'aws-us-east-1-portal.23.dblayer.com',
    port: 16118,
    pass: process.env.CFCI_REDIS_PASSWORD
  },
  secrets: {
    session: process.env.CFCI_SESS_SECRET
  },
  authStrategy: process.env.AUTH_STRAT || 'idaas',

  sendgridApiKey: process.env.CFCI_SENDGRID_API_KEY,

  tokenSecret: process.env.CFCI_JWT_TOKEN_SECRET,
  jwtAlgorithms: ['HS256'],

  w3APIs: {
    taxonomies: 'w3.api.ibm.com/common/run/taas/taxonomies',
    w3ClientSecret: process.env.CFCI_W3_CLIENT_ID
  }
};

// Merge specific NODE_ENV configuration settings into environment
environment = _.merge(environment, require('./' + process.env.NODE_ENV + '.js'));

module.exports = environment;
