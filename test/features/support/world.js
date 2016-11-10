'use strict';

process.env.NODE_ENV = 'test';
const _ = require('lodash');
const Browser = require('zombie');
const config = require('../../../server/config/environment');
const url = require('url');
const Pouchdb = require('pouchdb');
Pouchdb.plugin(require('pouchdb-find'));

Browser.localhost('wwwpoc.ibm.com:443', 9001);
Browser.localhost('wwwpoc.ibm.com', 9000);
Browser.localhost('idaas.iam.ibm.com:443', 9010);
Browser.localhost('1.www.s81c.com:443', 9020);

const webBase = 'https://' + config.webHost + ':9001' + config.webRoot;

function World() {
  this.browser = new Browser({
    strictSSL: false,
    waitDuration: '30s'
  });

  this.browser.pipeline.addHandler((browser, request) => {
    let index = request.url.lastIndexOf('api/');
    if (index >= 0 && !request.url.includes('api/download/cmc/csv')) {
      request.url = url.resolve(webBase, request.url.slice(index));
    }
  });

  this.browser.on('opened', window => {
    window.cancelAnimationFrame = _.noop;
    window.Blob = window.File;
  });

  this.usersDB = new Pouchdb(config.dbdir + config.usersDB);

  this.webHost = config.webHost;
  this.webRoot = config.webRoot;
  this.webPort = config.cfApp.port;
  this.locationBase = 'https://' + this.webHost + ':9001' + this.webRoot;
}

module.exports = function() {
  this.World = World;
};
