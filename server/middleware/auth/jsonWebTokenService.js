/**var jwt = require('jsonwebtoken');
var JWTStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var passport = require('passport');
var config = require('../environment');
var serviceDBService = require('../../api/services/serviceDB.service');
var logger = require('../../components/logger').get('security');

//Create a payload for a new JWT Token
function constructJWT(service) {
  var payload = {};
  payload.roles = service.roles;
  payload.sub = service._id;
  payload.description = service.description;

  return jwt.sign(payload, config.tokenSecret);
}

//This method will handle the authentication logic for jwtToken using an apikey
function verifyPayload(req, jwtPayload, done) {
  serviceDBService.getService(jwtPayload.sub)
    .then(function getServiceCallback(result) {
      req.user = {
        _id: jwtPayload.sub,
        roles: jwtPayload.roles,
        strategy: 'jwt'
      };
      done(null, req.user);
    }).catch(function catchCallback(err) {
      logger.error('JWT Authentication Error %s', err);
      done(err, null);
    });
}

function middleware (app, passport) {
  var jwtStrategy = new JWTStrategy({
    secretOrKey: config.tokenSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    algorithms: config.jwtAlgorithms,
    passReqToCallback: true
  }, verifyPayload);

  passport.use(jwtStrategy);

  app.use('/api/invite', passport.authenticate('jwt', {session: false}));
}

module.exports.middleware = middleware;
module.exports.constructJWT = constructJWT; **/
