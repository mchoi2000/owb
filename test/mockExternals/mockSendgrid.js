//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

const bodyParser = require('body-parser');
const express = require('express');

var app = express();

app.set('x-powered-by', false);

app.use(bodyParser.json({limit: '15mb'}));
app.use(bodyParser.urlencoded({extended: true}));

app.all('*', function(req, res) {
  res.status(200).end();
});

var server = require('http').createServer(app);
server.listen(9060);
