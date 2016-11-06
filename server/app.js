/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */

'use strict';
var fs = require('fs');
var path = require('path');
var pem = require('pem');

var express = require('express');
var passport = require('passport');
var logger = require('./components/logger').get('app');

var config = require('./config/environment');

var rootApp = express();
var app = express();

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || config.nodeEnv;

rootApp.use('/marketplace/operator', app);
rootApp.set('x-powered-by', false);

require('./middleware')(app, passport);
require('./routes')(app, passport);

var server = require('http').createServer(rootApp);
server.listen(config.cfApp.port, null, function () {
  logger.info('Express server listening on %d, in %s mode',
    config.cfApp.port,
    app.get('env'));
});

// Setup https server when local
if (process.env.LOCAL) {
  var sslOpts = {
    pfx: fs.readFileSync(path.join(config.root, process.env.PFX))
  };
  var secure = require('https').createServer(sslOpts, rootApp);
  secure.listen(9001);
} else if (process.env.NODE_ENV === 'test') {
  pem.createCertificate({days:1, selfSigned:true}, function(err, keys) {
    var secure = require('https').createServer({
      key: keys.serviceKey,
      cert: keys.certificate
    }, rootApp);
    secure.listen(9001);
  });
}
