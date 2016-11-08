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
const roles = require('./auth/roles');
const userAuth = require('./auth/idaas');
const RedisStore = require('connect-redis')(expressSession);

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

  var enforceTLS = function enforceTLS(req, res, next) {
    if (typeof req.headers['$wsis'] !== 'undefined' && req.headers['$wsis'] === 'false') {
      return res.redirect('https://' + config.webHost + req.originalUrl);
    }
    next();
  };
  app.use(enforceTLS);

  const store = new RedisStore(config.redis);
  app.use(expressSession({
    name: 'JSESSIONID', // Use bluemix session affinity
    store: store,
    secret: config.secrets.session,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    rolling: true,
    cookie: {
      path: config.webRoot.slice(0, -1),
      maxAge: 86400000, //1 Day
      httpOnly: true,
      secure: true
    }
  }));

  // Clear cache for non-authenticated users when they hit back button
  // from the IBM signout page after signing out.
  app.use(function(req, res, next) {
    if (!req.user) {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      next();
    }
  });

  //logging request details
  app.use(morgan('combined', {
    stream: {
      write: function writeFunction(message, encoding) {
        logger.debug(message);
      }
    }
  }));

  //Passport config
  app.use(passport.initialize());
  app.use(passport.session());

  userAuth.middleware(app, passport);

  //CSRF Protections
  app.use(function appUseCallback(req, res, next) {
    if (!req.user || !req.user.strategy || req.user.strategy !== 'jwt') {
      csrf()(req, res, next);
    } else {
      next();
    }
  });
  app.use(function appUseCallback(req, res, next) {
    if (req.csrfToken) {
      res.cookie('XSRF-TOKEN', req.csrfToken(), {
        path: config.webRoot.slice(0, -1),
        secure: true
      });
    }
    next();
  });

  if (env === 'production' || env === 'staging' || env === 'test') {
    app.use('/', express.static(path.join(config.root, 'client/public'), {
      index: false,
      setHeaders: cacheBust
    }));
    app.use('/common',
      express.static(path.join(config.root, 'client/common'), staticOpts));
    app.use('/register/cmm', roles.is('unregistered operator'),
      express.static(path.join(config.root, 'client/register'), staticOpts));
    app.set('appPath', path.join(config.root, 'client'));
    app.use('/register', roles.is('unregistered operator'),
      express.static(path.join(config.root, 'client/register'), staticOpts));
  }

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
      app.use('/register/cmm', roles.is('unregistered operator'),
        express.static(path.join(config.root, 'client/register'), staticOpts));
      app.use('/register', roles.is('unregistered operator'),
        express.static(path.join(config.root, 'client/register'), staticOpts));

      app.use('/', express.static(path.join(config.root, '.tmp/public'), staticOpts));
      app.use('/common',
        express.static(path.join(config.root, '.tmp/common'), staticOpts));
      app.use('/review', roles.is('registered operator'),
        express.static(path.join(config.root, '.tmp/review'), staticOpts));
      app.use('/review', roles.is('registered operator'),
        express.static(path.join(config.root, 'client/review'), staticOpts));
      app.use('/register', roles.is('unregistered operator'),
        express.static(path.join(config.root, '.tmp/register'), staticOpts));

    }

    if (config.root.endsWith('/dist')) {
      app.set('appPath', path.join(config.root, 'client'));
    } else {
      app.set('appPath', path.join(config.root, '.tmp'));
    }
  }

};
