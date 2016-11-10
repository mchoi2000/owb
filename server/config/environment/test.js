//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
// Test specific configuration
// ===========================
module.exports = {

  // Host of application for IBM Marketplace
  webHost: 'localhost',

  //Logging Config
  logging: {
    silent: false,
    level: 'debug',
    dir: './.tmp/logs',
    categories: {
      app: ['Console'],
      access: ['Console'],
      security: ['Console'],
      db: ['Console'],
      user: ['Console']
    }
  },

  dbUrl: 'http://127.0.0.1:5984',
  dbdir: 'http://127.0.0.1:5984/',
  usersDB: 'userdb',

  remoteDBOptions: {},

  redis: {
    db: 1
  },

  idaas: {
    authURL: 'https://localhost:9010/idaas/oidc/endpoint/default/authorize',
    tokenURL: 'https://localhost:9010/idaas/oidc/endpoint/default/token',
    clientID: 'testid',
    clientSecret: 'testsecret',
    callbackURL: 'https://localhost:9001' + process.env.CFCI_WEB_ROOT + '/auth/sso/oidc/return',
    issuer: 'https://idaas.iam.ibm.com'
  },

  diverUrl: 'https://localhost:9020/marketplace/api/search/v3/api_search?terms=watson',
  diverKeySearchURL: 'https://localhost:9020/marketplace/api/search/v3/product_key_search?key=2860',

  //Prevent emails being sent during testing
  sendgridApiKey: 'INVALID_KEY',
  sendgridHost: 'localhost',
  sendgridPort: 9060,
  sendgridTest: true
};
