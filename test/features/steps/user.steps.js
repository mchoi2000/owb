'use strict';

// jshint unused:false
const should = require('should');

module.exports = function () {

  this.Given(/^I am not registered$/, function () {
    return this.usersDB.get(this.testUser._id)
    .catch(() => this.testUser)
    .then(user => {
      user.registered = false;
      return this.usersDB.put(user);
    });
  });
};
