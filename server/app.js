/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */

'use strict';
var express = require('express');
var path = require('path');
var passport = require('passport');
var logger = require('./components/logger').get('app');

var config = require('./config/environment');

var rootApp = express();
var app = express();

rootApp.use('/marketplace/operator', app);

require('./middleware')(app, passport);
require('./routes')(app, passport);

var server = require('http').createServer(rootApp);
server.listen(config.cfApp.port, null, function () {
  logger.info('Express server listening on %d, in %s mode',
    config.cfApp.port,
    app.get('env'));
});
