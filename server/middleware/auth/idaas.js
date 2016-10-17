//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
/** IDaaS Passport Strategy Solution **/
'use strict';

var config = require('../../config/environment');
var logger = require('../../components/logger').get('security');
var OIDCStrategy = require('./passport-idaas-openidconnect/lib').IDaaSOIDCStrategy;
//var roles = require('./roles');
//var userService = require('../../api/user/user.service');

// Configure sso middleware
module.exports = {
  middleware: middleware,
  routes: routes
};

function middleware(app, passport) {
  // If user doesn't exist, add to database
  passport.serializeUser(function serializeUserCallback(user, done) {
    logger.debug('Serializing User %s', user.id);
    done();
  });

  passport.deserializeUser(function deserializeUserCallback(id, done) {
    logger.silly('Deserialize User %s', id);
    done(null, false);
  });

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  var strategyObj = new OIDCStrategy({
      authorizationURL: config.idaas.authURL,
      tokenURL: config.idaas.tokenURL,
      clientID: config.idaas.clientID,
      clientSecret: config.idaas.clientSecret,
      callbackURL: config.idaas.callbackURL,
      skipUserProfile: true,
      issuer: config.idaas.issuer
    },
    function OIDCStrategyCallback(iss, sub, profile, accessToken, refreshToken, params, done) {
      logger.debug('Verifying Authenticated User %s', sub);
      return done(null, {
        id: profile._json.uniqueSecurityName,
        email: profile._json.email,
        fname: profile._json.given_name,
        lname: profile._json.family_name
      });
    }
  );
  passport.use(strategyObj);

  app.use('/cmm', ensureAuthenticated);

  function ensureAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
      return req.session.save(function saveSession() {
        return res.redirect('/marketplace/auth/sso');
      });
    }
    next();
  }

  function ensureRegistered(req, res, next) {
    if (!req.user.registered && req.originalUrl.indexOf('register') === -1) {
      logger.debug('Redirect Unregistered User');
      req.session.returnTo = req.originalUrl;

      return req.session.save(function saveSession() {
        return res.redirect(config.webRoot + 'register');
      });
    }
    next();
  }
}

// Configure sso routes
function routes(app, passport) {

  app.get('/auth/sso', passport.authenticate('openidconnect'));

  app.get('/auth/sso/oidc/return', function getOidcReturnCallback(req, res, next) {
    passport.authenticate('openidconnect', function authenticateCallback(err, user, info) {
      if (err) {
        logger.error('Authentication Error: ', err);
        return next(err);
      }

      if (!user) {
        logger.warn('User Authentication Failed');
        return res.redirect(config.webRoot + 'auth/fail');
      }
      logger.debug('User %s authenticated', user.email);
      req.login(user, function loginCallback(err) {
        if (err) {
          logger.error('Login Error: %s', err);
          return next(err);
        }

        res.redirect('/marketplace/cmm');

      });
    })(req, res, next);
  });

  app.get('/auth/fail', function getAuthFailCallback(req, res) {
    res.status(403).end();
  });

}
