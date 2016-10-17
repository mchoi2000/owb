//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
/** IDaaS Passport Strategy Solution
'use strict';

var config = require('../../config/environment');
var logger = require('../../components/logger').get('security');
var OIDCStrategy = require('./passport-idaas-openidconnect/lib').IDaaSOIDCStrategy;
var roles = require('./roles');
var userService = require('../../api/user/user.service');

// Configure sso middleware
module.exports = {
  middleware: middleware,
  routes: routes
};

function middleware(app, passport) {
  // If user doesn't exist, add to database
  passport.serializeUser(function serializeUserCallback(user, done) {
    logger.debug('Serializing User %s', user.id);
    userService.getUser(user.id)
      .then(function getUserSuccessCallback(doc) {
          logger.debug('User %s already serialized', user.id);
          done(null, user.id);
        },
        function getUserFailureCallback(err) {
          logger.debug('Adding new user %s', user.id);
          userService.addUser(user)
            .then(function addUserCallback() {
              done(null, user.id);
            });
        });
  });

  passport.deserializeUser(function deserializeUserCallback(id, done) {
    logger.silly('Deserialize User %s', id);
    userService.getUser(id)
      .then(function getUserCallback(user) {
        done(null, user);
      })
      .catch(function userNotFound(reason) {
        return done(null, false);
      });
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

  app.use('/admin/', ensureAuthenticated);
  app.use('/provider/', ensureAuthenticated, ensurePwbAccess, ensureRegistered);
  app.use('/qualification/', ensureAuthenticated);
  app.use('/register/', ensureAuthenticated, ensurePwbAccess);
  app.use('/review/', ensureAuthenticated);
  app.use('/translation/', ensureAuthenticated);

  function ensureAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
      return req.session.save(function saveSession() {
        return res.redirect(config.webRoot + 'auth/sso');
      });
    }
    next();
  }

  function ensurePwbAccess(req, res, next) {
    if (req.user.PWBPlatform !== true &&
      req.user.roles.indexOf('admin') === -1 &&
      req.user.roles.indexOf('academy') === -1) {
      logger.debug('Redirect non PWB User');
      return res.redirect(config.webRoot + 'sorryPage');
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
        userService.getUser(user.id)
          .then(function getUserCallback(userDoc) {
            var url = _roleHome(userDoc.roles[0], userDoc.PWBPlatform);
            if (req.session && req.session.returnTo) {
              url = req.session.returnTo;
              delete req.session.returnTo;
            }

            return req.session.save(function saveSession(err) {
              logger.debug('Redirecting authenticated user to %s', url);
              res.redirect(url);
            });
          });
      });
    })(req, res, next);
  });

  app.post('/auth/register', roles.is('unregistered provider'), function register(req, res) {
    if (!req.user.registered) {
      var user = {
        _id: req.user._id,
        fname: req.body.fname,
        lname: req.body.lname,
        phoneNumber: req.body.phoneNumber,
        projectRole: req.body.projectRole,
        registered: true
      };

      return userService.updateUser(user)
        .then(function updateUserSuccessCallback(response) {
          return res.sendStatus(200);
        }, function updateUserFailureCallback(err) {
          logger.error('Error updating user %s registration: %s', req.user._id, err);
        });
    }

    logger.warn('User %s already registered', req.user._id);
    return res.sendStatus(404);
  });

  app.get('/auth/logout', roles.is('authenticated'), function getAuthLogoutCallback(req, res) {
    logger.debug('Logging out user %s', req.user._id);
    req.session.destroy(function sessionDestroyCallback() {
      req.session = null;
      res.clearCookie('JSESSIONID', {
        path: '/'
      });
      req.logOut();
      res.redirect('https://www.ibm.com/account/us-en/signout.html?lnk=mmi');
    });
  });

  app.get('/auth/fail', function getAuthFailCallback(req, res) {
    res.status(403).end();
  });

  //TODO: Add Commerce Reviewer Dashboard Homepage
  function _roleHome(role, pwbEnabled) {
    var home = config.webRoot;
    switch (role) {
      case 'provider':
        if (pwbEnabled) {
          home = home + '/provider/dashboard';
        } else {
          home = home + '/qualification';
        }
        break;
      case 'admin':
        home = home + '/admin';
        break;
      case 'qualificationReviewer':
        home = home + '/review/qualification';
        break;
      case 'commerceReviewer':
        home = home + '/review/commerce';
        break;
      case 'contentReviewer':
        home = home + '/review/content';
        break;
      case 'cmmReviewer':
        home = home + '/review/cmm';
        break;
      case 'academy':
        home = home + '/provider/dashboard';
        break;
      default:
        home = home + '/qualification';
    }

    logger.debug('Homepage %s for user role %s', home, role);
    return home;
  }
}
 **/
