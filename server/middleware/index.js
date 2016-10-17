/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const csrf = require('csurf');
const morgan = require('morgan');
const path = require('path');
const config = require('../config/environment');
const logger = require('../components/logger').get('access');
//const roles = require('./auth/roles');
//const userAuth = require('./auth/idaas');
//const RedisStore = require('connect-redis')(expressSession);

module.exports = function exportsMiddleware(app, passport) {

  const staticOpts = {index: false, redirect: false, setHeaders: cacheBust};

  const bustRegex = /^.*-[\da-fA-F]{10}\.(?:js|css)$/;
  function cacheBust(res, path, stat) {
    if (bustRegex.test(path)) {
      res.set('cache-control', 'public max-age=31536000'); //Max Age: non-leap calendar year
    }
  }
  var env = app.get('env');

  //userAuth.middleware(app, passport);
  app.set('x-powered-by', false);
  app.set('trust proxy', true);

  app.use(bodyParser.json({limit: '15mb'}));
  app.use(bodyParser.urlencoded({extended: true}));

  // Clear cache for non-authenticated users when they hit back button
  // from the IBM signout page after signing out.
  app.use(function(req, res, next) {
    if (!req.user) {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      next();
    }
  });

  if (env === 'development') {
    if (process.env.LOCAL) {
      app.use(require('connect-livereload')({ignore:
        [
          /\.js(\?.*)?$/, /\.css(\?.*)?$/, /\.svg(\?.*)?$/, /\.ico(\?.*)?$/, /\.woff(\?.*)?$/,
          /\.png(\?.*)?$/, /\.jpg(\?.*)?$/, /\.jpeg(\?.*)?$/, /\.gif(\?.*)?$/, /\.pdf(\?.*)?$/,
          /\.json(\?.*)?$/, 'api', 'auth', 'components', 'app', 'bower_components', 'assets',
          'images'
        ]
      }));

      app.use('/', express.static(path.join(config.root, 'client/public'), {
        index: false,
        setHeaders: cacheBust
      }));
      app.use('/common',
        express.static(path.join(config.root, 'client/common'), staticOpts));

      app.use('/', express.static(path.join(config.root, '.tmp/public'), staticOpts));
      app.use('/common',
        express.static(path.join(config.root, '.tmp/common'), staticOpts));

    }

    if (config.root.endsWith('/dist')) {
      app.set('appPath', path.join(config.root, 'client'));
    } else {
      app.set('appPath', path.join(config.root, '.tmp'));
    }
  }

};
