//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
exports.config = {
  allScriptsTimeout: 11000,

  specs: ['e2e/*.js'],

  sauceUser: process.env.CFCI_SAUCE_USER,
  sauceKey: process.env.CFCI_SAUCE_KEY,

  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

  multiCapabilities: [{
    // by default, these first two browsers will come up in
    // Linux if you don't specify an OS
    'name': 'Chrome - Linux',
    'browserName': 'chrome',
    'build': process.env.TRAVIS_BUILD_NUMBER
  }, {
    'name': 'Firefox - Linux',
    'browserName': 'firefox',
    'platform': 'linux',
    'build': process.env.TRAVIS_BUILD_NUMBER
  }, {
    'name': 'Firefox - Windows',
    'browserName': 'firefox',
    'platform': 'windows',
    'build': process.env.TRAVIS_BUILD_NUMBER
  },
  {
    'name': 'Chrome - Windows',
    'browserName': 'chrome',
    'platform': 'windows',
    'build': process.env.TRAVIS_BUILD_NUMBER
  },
  {
    'name': 'Safari - Mac',
    'browserName': 'safari',
    'platform': 'OS X 10.10',
    'build': process.env.TRAVIS_BUILD_NUMBER
  }]
};
