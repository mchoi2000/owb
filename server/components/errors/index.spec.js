//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

/* jshint unused: false */
var should = require('should');
var errors = require('./index');

describe('GET 404', function() {

  var req = {path:''};
  var res = {
    status: function(code) {
      code.should.equal(404);
    },
    sendFile: function(errorFileName) {
      errorFileName.should.equal(__dirname + '/templates/404.html');
    },
    end: function() {}
  };

  errors.pageNotFound(req, res);
  errors.invalidRequest(req, res);

});
