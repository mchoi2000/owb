//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

var config = require('../../config/environment');
var Pouchdb = require('pouchdb');
var util = require('util');

module.exports = {
  denodeify: denodeify,
  MockPouchWrapper: MockPouchWrapper,
  Errors: {
    PWBError: PWBError,
    MissingError: MissingError,
    ConflictError: ConflictError
  }
};

function denodeify(fn, argumentCount) {
  argumentCount = argumentCount || Infinity;
  return function denodeifyWrapper() {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    return new Promise(function denodeifyPromise(resolve, reject) {
      while (args.length && args.length > argumentCount) {
        args.pop();
      }
      args.push(function callback(err, res) {
        console.log('Error is::::', err);
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
      var res = fn.apply(self, args);
      if (res && (typeof res === 'object' || typeof res === 'function') &&
          typeof res.then === 'function') {
        resolve(res);
      }
    });
  };
}

function MockPouchWrapper(id) {
  var self = this;

  self.dbs = [];
  self.MockPouch = function(name, ops) {
    name = name.replace(config.dbUrl, '');

    var db = new Pouchdb(name + id, {db : require('memdown')});
    self.dbs.push(db);
    return db;
  }

  self.MockPouch.plugin = function(plugin) {
    Pouchdb.plugin(plugin);
  };

  self.close = function() {
    let promises = self.dbs.map(function (db) {
      return db.destroy();
    });

    self.dbs = [];
    return Promise.all(promises);
  }
}

function ConflictError(documentId, oldRev, message, newRev) {
  var self = this;
  Error.captureStackTrace(this, this.constructor);
  self.name = self.constructor.name;
  self.message = message;
  self.documentId = documentId;
  self.oldRev = oldRev;
  self.newRev = newRev;
}
util.inherits(ConflictError, Error);

function MissingError(documentId, message) {
  var self = this;
  Error.captureStackTrace(this, this.constructor);
  self.name = self.constructor.name;
  self.message = message;
  self.documentId = documentId;
}
util.inherits(MissingError, Error);

function PWBError(message) {
  var self = this;
  Error.captureStackTrace(this, this.constructor);
  self.name = self.constructor.name;
  self.message = message;
}
util.inherits(PWBError, Error);

