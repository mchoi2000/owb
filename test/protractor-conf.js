//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
exports.config = {
  seleniumServerJar: '../node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar',
  chromeDriver: '../node_modules/webdriver-manager/selenium/chromedriver',
  allScriptsTimeout: 11000,

  specs: [
    'e2e/*.js'
  ],

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
