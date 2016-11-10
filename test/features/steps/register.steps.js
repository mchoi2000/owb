'use strict';

// jshint unused:false
const should = require('should');

module.exports = function () {

  this.Given(/^I visit the registration page$/, function () {
    return this.browser.visit(this.locationBase + 'register/cmm');
  });
};
