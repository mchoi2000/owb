//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

// Development specific configuration
// ==================================

module.exports = {
  webHost: 'opwb.w3ibm.mybluemix.net',

  //Cloudant URL
  dbUrl: 'https://opwb.cloudant.com',
  dbdir: './db/',
  usersDB: 'prod-user',
  userAuditDB: 'prod-user-audit',

  remoteDBOptions: {
    auth: {
      username: process.env.CFCI_CLOUDANT_USERNAME,
      password: process.env.CFCI_CLOUDANT_PASSWORD
    }
  },

  //Logging Config
  logging: {
    silent: true,
    level: 'silent',
    dir: './.tmp/logs',
    categories: {
      app: ['Console', 'File'],
      access: ['Console', 'File'],
      security: ['Console', 'File'],
      db: ['Console', 'File'],
      user: ['Console', 'File']
    }
  },

  idaas: {
    authURL: 'https://w3id.sso.ibm.com/isam/oidc/endpoint/amapp-runtime-oidcidp/authorize',
    tokenURL: 'https://w3id.sso.ibm.com/isam/oidc/endpoint/amapp-runtime-oidcidp/token',
    clientID: process.env.CFCI_IDAAS_CLIENT,
    clientSecret: process.env.CFCI_IDAAS_SECRET,
    callbackURL: process.env.CFCI_IDAAS_CALLBACK,
    issuer: 'https://w3id.sso.ibm.com/isam'
  },
  emails: {
    owbTeamEmail: ['owbteam@us.ibm.com'],
    owbTeamName: 'Operator Workbench team',
    noreplyEmail: 'noreply@operatorworkbench.com'
  },

  pwbConfig: {
    hostURL: 'https://www.ibm.com',
    webRoot: '/marketplace/workbench/',
    secureToken: process.env.PWB_JWT_TOKEN,
    api: {
      getDocsWithTranslation: 'api/translation/getDocsWithTranslation'
    }
  }
};
