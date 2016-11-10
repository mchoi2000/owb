//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const base64url = require('base64url');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const jwt = require('jsonwebtoken');
const pem = require('pem');

const accessToken = 'accessToken';

var hash;
var halfHash;

hash = crypto.createHash('sha256').update(accessToken).digest('hex');
halfHash = hash.slice(0, (hash.length) / 2.0);
var base64Ver = new Buffer(halfHash, 'hex').toString('base64');
const atHash = base64url.fromBase64(base64Ver);

var app = express();

app.set('x-powered-by', false);

app.use(bodyParser.json({limit: '15mb'}));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/idaas/oidc/endpoint/default/authorize', function(req, res) {
  res.redirect(req.query.redirect_uri + '?scope=openid&code=NOCODE');
});

app.post('/idaas/oidc/endpoint/default/token', function(req, res) {
  const body = {
    ext: '{"tenantId": "www.ibm.com"}',
    at_hash: atHash,
    realmName: 'idaas.iam.ibm.com',
    uniqueSecurityName: 'testUserId',
    preferred_username: 'testUser',
    given_name: 'Bungaree',
    family_name: 'Chubbins',
    email: 'testUser@test.com'
  };

  const options = {
    algorithm: 'RS256',
    issuer: 'https://idaas.iam.ibm.com',
    subject: 'testUserId',
    audience: req.body.client_id,
    expiresIn: 6000
  };

  pem.createPrivateKey(function(err, keys) {
    jwt.sign(body, keys.key, options, function(err, token) {
      res.status(200).json({
        access_token: accessToken,
        refresh_token: 'refreshToken',
        id_token: token
      });
    });
  });
});

pem.createCertificate({days:1, selfSigned:true}, function(err, keys) {
  var secure = require('https').createServer({
    key: keys.serviceKey,
    cert: keys.certificate
  }, app);
  secure.listen(9010);
});
