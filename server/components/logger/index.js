//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

var mkdirp = require('mkdirp');
var Logger = require('le_node');
var winston = require('winston');
var config = require('../../config/environment');
var mkdirp = require('mkdirp');

mkdirp.sync(config.logging.dir);
console.assert(winston.transports.Logentries);

var container = new winston.Container({
  level: config.logging.level,
  silent: config.logging.silent
});

var consoleTransport = new winston.transports.Console({
  timestamp: true,
  colorize: true,
  level: config.logging.level,
  silent: false
});

for (var category in config.logging.categories) {
  var loggerTrans = [];
  for (var index in config.logging.categories[category]) {
    var transport = config.logging.categories[category][index];
    if (transport === 'Console') {
      loggerTrans.push(consoleTransport);
    } else if (transport === 'File') {
      loggerTrans.push(new winston.transports.File({
        dirname: config.logging.dir,
        filename: category + '.log',
        timestamp: true
      }))
    } else if (transport === 'Logentries') {
      var logentriesLogger = new winston.transports.Logentries({
        token: config.logentriesToken});
      loggerTrans.push(logentriesLogger);
    }
  }
  container.add(category, {transports: loggerTrans});
}

module.exports = container;
