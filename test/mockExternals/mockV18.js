//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const bodyParser = require('body-parser');
const express = require('express');
const pem = require('pem');

var app = express();

app.set('x-powered-by', false);

app.use(bodyParser.json({limit: '15mb'}));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/common/v18/css/www.css', function(req, res) {
  res.status(200).end();
});

app.get('/common/v18/js/www.js', function(req, res) {
  var v18LoginMockText = '\'use strict\';';

  v18LoginMockText += 'var IBMCore = ';

  v18LoginMockText += '{common: {';
  v18LoginMockText += 'util: {config: {set:function() {}}},';
  v18LoginMockText += 'module: {';
  v18LoginMockText += 'masthead: {';
  v18LoginMockText += 'subscribe: function(ready, customjs, fn) {';

  v18LoginMockText += 'fn();';
  v18LoginMockText += '},';

  // Build the v18 Profile menu and inject into the page
  v18LoginMockText += 'editProfileMenu: function(action, links) {';

  // MyIBM
  v18LoginMockText += 'var a = document.createElement("a");';
  v18LoginMockText += 'var linkText = document.createTextNode("MyIBM");';
  v18LoginMockText += 'a.appendChild(linkText);';
  v18LoginMockText += 'a.setAttribute("href", "https://www.ibm.com/myibm/?lnk=mmi");';
  v18LoginMockText += 'document.body.appendChild(a);';

  // Profile
  v18LoginMockText += 'var a = document.createElement("a");';
  v18LoginMockText += 'var linkText = document.createTextNode("Profile");';
  v18LoginMockText += 'a.appendChild(linkText);';
  v18LoginMockText += 'a.setAttribute("href", "https://www.ibm.com/myibm/profile/?lnk=mmi");';
  v18LoginMockText += 'document.body.appendChild(a);';

  // Products and services
  v18LoginMockText += 'var a = document.createElement("a");';
  v18LoginMockText += 'var linkText = document.createTextNode("Products and services");';
  v18LoginMockText += 'a.appendChild(linkText);';
  v18LoginMockText += 'a.setAttribute("href", ';
  v18LoginMockText += '"https://www.ibm.com/myibm/products-services/?lnk=mmi");';
  v18LoginMockText += 'document.body.appendChild(a);';

  // Notifications
  v18LoginMockText += 'var a = document.createElement("a");';
  v18LoginMockText += 'var linkText = document.createTextNode("Notifications");';
  v18LoginMockText += 'a.appendChild(linkText);';
  v18LoginMockText += 'a.setAttribute("href", ';
  v18LoginMockText += '"https://myibm-notifications-prod.mybluemix.net/myibm/notifications/");';
  v18LoginMockText += 'document.body.appendChild(a);';

  // Support
  v18LoginMockText += 'var a = document.createElement("a");';
  v18LoginMockText += 'var linkText = document.createTextNode("Support");';
  v18LoginMockText += 'a.appendChild(linkText);';
  v18LoginMockText += 'a.setAttribute("href", "http://www.ibm.com/support/en-us/?lnk=mmi");';
  v18LoginMockText += 'document.body.appendChild(a);';

  // Sign In
  v18LoginMockText += 'var a = document.createElement("a");';
  v18LoginMockText += 'var linkText = document.createTextNode("Sign In");';
  v18LoginMockText += 'a.appendChild(linkText);';
  v18LoginMockText += 'a.setAttribute("onclick", \'location.href = "auth/sso"\');';
  v18LoginMockText += 'document.body.appendChild(a);';

  v18LoginMockText += '}';

  v18LoginMockText += '}';
  v18LoginMockText += '}}}';

  const js = v18LoginMockText;
  res.set('Content-Type', 'application/x-javascript');
  res.send(js);
});

app.get('/common/stats/ida_stats.js', function(req, res) {
  res.status(200).end();
});

app.get('/marketplace/api/search/v3/api_search', function(req, res) {
  res.status(200).json({results: {items: [{
      doc: {
        name: 'Watson',
        url: 'http://localhost:9010',
        'product-key': 'testKey'
      }
    },
    {
      doc: {
        name: 'Watson',
        url: 'http://localhost:9010',
        'product-key': 'testKey'
      }
    },
    {
      doc: {
        name: 'Watson',
        url: 'http://localhost:9010',
        'product-key': 'testKey'
      }
    },
    {
      doc: {
        name: 'Watson',
        url: 'http://localhost:9010',
        'product-key': 'testKey'
      }
    }]}});
});

app.get('/marketplace/api/search/v3/product_key_search', function(req, res) {
  res.status(200).json({results: {items: [{
      doc: {
        name: 'Watson',
        url: 'http://localhost:9010',
        'product-key': 'testKey'
      }
    }]}});
});

app.get('/standards/information/tmt/output/Draft' +
        '/ibmww/mo/bds/xml/Marketing/Contact_Modules_0100.xml',
        function(req, res) {
          res.status(500).end();
        });

pem.createCertificate({days:1, selfSigned:true}, function(err, keys) {
  var secure = require('https').createServer({
    key: keys.serviceKey,
    cert: keys.certificate
  }, app);
  secure.listen(9020);
});
