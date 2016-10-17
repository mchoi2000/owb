/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */
'use strict';

var config = require('./config/environment');
var errors = require('./components/errors');
var path = require('path');
//var roles = require('./config/auth/roles');
//var auth = require('./config/auth/idaas');

module.exports = function exportRoutes(app, passport) {
  var env = app.get('env');

  // Insert routes below
  //auth.routes(app, passport);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|client/public/bower_components|assets|images)/*')
    .get(function routeGetCallback(req, res) {
      errors.invalidRequest(req, res);
    });

  // All secured invalid routes redirect should return IBM 404 error page
  app.route('/common/error')
    .get(function getHomeErrorCallback(req, res) {
      errors.pageNotFound(req, res);
    });

  // Angular Apps: Anything else should serve up an angular app index
  // Admin App
  // Review App
  app.route('/review*')
    .get(function reviewApp(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/review/index.html'));
    });

  // Translation App
  app.route('/translation*')
    .get(function translationApp(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/translation/index.html'));
    });

  // All other routes should redirect to the public index.html
  app.route('/*')
    .get(function publicApp(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/public/index.html'));
    });
};
